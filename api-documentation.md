openapi: 3.0.0
servers:
  # Added by API Auto Mocking Plugin
  - description: SwaggerHub API Auto Mocking
    url: https://virtserver.swaggerhub.com/strixthekiet/VsExam/0.2.2
  - description: Strix Cloud
    url: http://cloud.strixthekiet.me:8000/
info:
  description: An extension to hold exam
  version: "0.2.2"
  title: VSExam API
  license:
    name: Apache 2.0
    url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
tags:
  - name: student
    description: used by student's vscode extension
  - name: teacher
    description: create exam and monitor
paths:
  /exam:
    post:
      tags:
        - teacher
      summary: create new exam
      description: Adds a scheduled exam to the database
      responses:
        '201':
          description: exam created
        '400':
          description: 'invalid input, object invalid'
        '409':
          description: an existing exam with same uniID, courseID and examID already exists
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Exam'
        description: Exam information to create
    get:
      tags:
        - teacher
      summary: Get exams information
      description: Get a list of exam in a university's course
      responses:
        '200':
          description: A list of exams in the course
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ExamSummary'
      parameters:
        - in: query
          name: uniId
          required: true
          schema:
            type: string
            format: lowercase
            example: vinuni
        - in: query
          name: courseID
          required: true
          schema:
            type: string
            example: COMP3010
  /exam/join-rq:
    post:
      tags:
        - student
      summary: Join an existing exam
      description: Allows a student to join an existing exam
      responses:
        '200':
          description: Student joined the exam successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  profName:
                    type: string
                    example: Pham Huy Hieu
                  examStartTime:
                    type: integer
                    format: Unix time
                    example: 1726505500000
                  duration:
                    type: integer
                    format: minutes
                    example: 60
                  material:
                    type: array
                    items:
                      type: string
                      format: pdf, docx, txt,...
                      example: instructions.pdf
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized to join the exam (e.g., missing credentials, not enrolled)
        '404':
          description: Exam not found
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                uniId:
                  type: string
                  format: lowercase
                  example: vinuni
                courseID:
                  type: string
                  example: COMP3010
                examID:
                  type: string
                  format: assignment_name-order
                  example: midterm-1
                studentID:
                  type: string
                  example: V202200679
                password:
                  type: string
                  example: secret
        description: Necessary information to join exam
  /exam/submission:
    post:
      tags:
        - student
      summary: Submit a joined exam
      description: Allows a student to submit their completed exam
      requestBody:
        content:
          multipart/form-data:  # Use multipart/form-data for file upload
            schema:
              type: object
              properties:
                uniId:
                  type: string
                  format: lowercase
                  example: vinuni
                courseID:
                  type: string
                  example: COMP3010
                examID:
                  type: string
                  format: assignment_name-order
                  example: midterm-1
                studentId:
                  type: string
                  description: The ID of the student submitting the exam
                submission: 
                  type: string
                  format: binary
                  description: The student's exam submission file (e.g., PDF, DOCX)
      responses:
        '200':
          description: Exam submitted successfully
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized to submit the exam (e.g., missing credentials, not joined)
        '404':
          description: Exam not found      
  /question/{question-nb}/grade-rq:
    post:
      tags:
        - student
      summary: Request grading for a question
      description: Allow grading for a question, receives how many test cases pass
      parameters:
        - in: path
          name: question-nb
          schema:
            type: integer
          required: true
          description: Numeric ID of the user to get
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - studentId
                - questionNumber
              properties:
                uniId:
                  type: string
                  format: lowercase
                  example: vinuni
                courseID:
                  type: string
                  example: COMP3010
                examID:
                  type: string
                  format: assignment_name-order
                  example: midterm-1
                studentID:
                  type: string
                  example: V202200679
                questionNumber:
                  type: integer
                  description: The index (1-based) of the question within the exam that the student wants graded.
      responses:
        '200':
          description: Grading request received successfully.
      
          content:
            application/json:
              schema:
                type: object
                properties:
                  passedTestCases:
                    type: integer
                    description: The number of test cases the student's code passed for the requested question.
                  failedTestCases:  # Optional property decided by the server
                    type: array
                    description: (Optional) An array of objects containing details about failed test cases (if the server decides to include this information).
                    items:
                      type: object
                      properties:
                        testCaseIndex:  # 1-based index of the failed test case
                          type: integer
                          description: The index of the failed test case within the question.
                        expectedOutput:
                          type: string
                          description: The expected output for the failed test case.
                        studentOutput:
                          type: string
                          description: The student's output for the failed test case.
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized to request grading (e.g., missing credentials, not in exam).
        '404':
          description: Exam not found.
  /break-rq:
    post:
      tags:
        - student
      summary: Request a break during exam
      description: Allows a student to send a request to pause the exam
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                uniId:
                  type: string
                  format: lowercase
                  example: vinuni
                courseID:
                  type: string
                  example: COMP3010
                examID:
                  type: string
                  format: assignment_name-order
                  example: midterm-1
                studentID:
                  type: string
                  example: V202200679
                reason:
                  type: string
                  description: (Optional) Reason for requesting the break
      responses:
        '200':
          description: Break request received successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  result:
                    type: boolean
                    description: accepted or unaccepted
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized to request a break (e.g., missing credentials, not in exam)
        '404':
          description: Exam not found
  /focus-lost:
    post:
      tags:
        - student
      summary: Notify server of lost exam window focus
      description: Informs the server that the student has clicked outside of the VS Code exam window
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                uniId:
                  type: string
                  format: lowercase
                  example: vinuni
                courseID:
                  type: string
                  example: COMP3010
                examID:
                  type: string
                  format: assignment_name-order
                  example: midterm-1
                studentID:
                  type: string
                  example: V202200679
                activeStatus:
                  type: boolean
                  description: Whether the window of VsCode is active
                focusStatus:
                  type: boolean
                  description: Whether the window of VsCode is in focus
      responses:
        '200':  # Consider using a more informative success code (e.g., 204 No Content)
          description: Lost focus notification received
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized (e.g., missing credentials, not in exam)
        '404':
          description: Exam not found
        
      
components:
  schemas:
    Exam:
      type: object
      required:
        - uniId
        - courseID
        - examID
        - examName
        - examStartTime
        - duration
        - password
      properties:
        uniId:
          type: string
          format: lowercase
          example: vinuni
        courseId:
          type: string
          example: COMP3010
        examId:
          type: string
          format: assignment_name-order
          example: midterm-1
        profName:
          type: string
          example: Pham Huy Hieu
        exam_start_time:
          type: integer
          format: Unix time
          example: 1726505500000
        duration:
          type: integer
          format: minutes
          example: 60
        password:
          type: string
          example: secret
        question:
          type: array
          items:
            $ref: '#/components/schemas/TestCase'
        material:
          type: array
          items:
            type: string
            format: pdf, docx, txt,...
            example: instructions.pdf
    TestCase:
      type: object
      required:
        - input
        - output
      properties:
        input:
          description: input of the question
        output:
          description: intended output of the question
    ExamSummary:
      type: object
      properties:
        examID:
          type: string
          format: assignment_name-order
          description: The exam ID (e.g., midterm-1)
        examName:
          type: string
          description: The name of the exam
        prof_name:
          type: string
          description: The professor's name (optional)
        examStartTime:
          type: integer
          format: Unix time
          description: The start time of the exam in Unix timestamp
        duration:
          type: integer
          format: minutes
          description: The duration of the exam in minutes
        material:
          type: array
          items:
            type: string
            format: pdf, docx, txt,...
          description: A list of material URLs (optional)