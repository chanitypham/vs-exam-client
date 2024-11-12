openapi: 3.0.0
servers:
  # Added by API Auto Mocking Plugin
  - description: SwaggerHub API Auto Mocking
    url: https://virtserver.swaggerhub.com/strixthekiet/VsExam/0.2.4
  - description: Strix Cloud
    url: https://vsexam.cloud.strixthekiet.me/
  - description: WS on Strixcloud
    url: ws://vsexam.cloud.strixthekiet.me/
info:
  description: An extension to hold exam
  version: 0.2.4
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

  /teacher:
    post:
      tags:
        - teacher
      summary: Create new teacher
      description: add new authenticated eacher
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                uniID:
                  type: string
                  example: vinuni
                profEmail:
                  type: string
                  example: hoang.vnh@vinuni.edu.vn
                authToken:
                  type: string
                  format: SHA256 encryption of profEmail+password
      responses:
        '200':
          description: created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: True
  /login:
    post:
      tags:
        - teacher
      summary: login for teacher
      description: ensure teacher's token are legitimate
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                profEmail:
                  type: string
                  example: hoang.vnh@vinuni.edu.vn
                authToken:
                  type: string
                  format: SHA256 encryption of profEmail+password
      responses:
        '200':
          description: Authentication is successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: True
  /exams:
    get:
      tags:
        - teacher
      summary: Get exams information
      description: Get a list of exams made by professor
      security:
        - bearerAuth: []
      responses:
        '200':
          description: A list of exams made by professor
          content:
            multipart/form-data:
              schema:
                type: array
                items:
                  type: object
                  required:
                    - examID
                    - examName
                    - examStartTime
                    - duration
                    - password
                  properties:
                    courseName:
                      type: string
                      example: Software Construction
                    examID:
                      type: string
                      format: assignment_name-order
                      example: midterm-1
                    examName:
                      type: string
                      example: Midterm 1
                    examStartTime:
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
                    testCases:
                      type: array
                      items:
                        $ref: '#/components/schemas/TestCase'
                    material:
                      type: array
                      items:
                        type: object
                        properties:
                          fileName:
                            type: string
                            example: instructions.pdf
                          materialContent:
                            type: string
                            format: binary
      parameters:
        - in: query
          name: uniID
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
            example: COMP2030
        - in: query
          name: profEmail
          required: true
          schema:
            type: string
            format: email
            example: hoang.vnh@vinuni.edu.vn

  /exam:
    get:
      tags:
        - teacher
      summary: Get exam information of prepared or finished exam
      description: Get information of a specific exam, prepared or finished
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Exam information
          content:
            multipart/form-data:
              schema:
                type: object
                required:
                  - examID
                  - examName
                  - examStartTime
                  - duration
                  - password
                properties:
                  courseName:
                    type: string
                    example: Software Construction
                  examID:
                    type: string
                    format: assignment_name-order
                    example: midterm-1
                  examName:
                    type: string
                    example: Midterm 1
                  examStartTime:
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
                  testCases:
                    type: array
                    items:
                      $ref: '#/components/schemas/TestCase'
                  material:
                    type: array
                    items:
                      type: object
                      properties:
                        fileName:
                          type: string
                          example: instructions.pdf
                        materialContent:
                          type: string
                          format: binary
      parameters:
        - in: query
          name: examID
          required: true
          schema:
            type: string
            format: given when made
            example: vinuni-COMP2030-midterm-1
    post:
      tags:
        - teacher
      summary: create new exam
      description: Adds a scheduled exam to the database, authorized with email and token
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Exam created successfully
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: 'User is not authorized to create exam'
        '409':
          description: 'ExamID must be unique'
        '500':
          description: 'Internal server error'
      parameters:
        - in: query
          name: uniID
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
            example: COMP2030
        - in: query
          name: profEmail
          required: true
          schema:
            type: string
            format: email
            example: hoang.vnh@vinuni.edu.vn
      requestBody:
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/Exam'
        description: Exam information to create

  /exam/join-rq:
    post:
      tags:
        - student
      summary: Join an existing exam
      description: Allows a student to join an existing exam
      parameters:
        - in: query
          name: studentID
          required: true
          schema:
            type: string
            example: V202200679
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                examID:
                  type: string
                  format: given by professor
                  example: vinuni-COMP2030-midterm-1
                password:
                  type: string
                  example: secret
      responses:
        '200':
          description: Student joined the exam successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  courseName:
                    type: string
                    example: COMP2030
                  profName:
                    type: string
                    example: Van Nguyen Hung Hoang
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
                      type: object
                      properties:
                        fileName:
                          type: string
                          example: instructions.pdf
                        materialContent:
                          type: string
                          format: binary
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized to join the exam (e.g., missing credentials, not enrolled)
        '404':
          description: Exam not found

  /exam/submission:
    post:
      tags:
        - student
      summary: Submit a joined exam
      description: Allows a student to submit their completed exam
      parameters:
        - in: query
          name: examID
          required: true
          schema:
            type: string
            format: given by professor
        - in: query
          name: studentID
          required: true
          schema:
            type: string
            example: V202200679
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  fileName:
                    type: string
                    example: Q1.py
                  content:
                    type: string
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
        - in: query
          name: examID
          schema:
            type: string
            format: given by professor
          required: true
        - in: query
          name: studentID
          required: true
          schema:
            type: string
            example: V202200679
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
              properties:
                fileName:
                  type: string
                  example: Q1.py
                content:
                  type: string
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
                  failedTestCases:
                    type: array
                    description: (Optional) An array of objects containing details about failed test cases (if the server decides to include this information).
                    items:
                      type: object
                      properties:
                        testCaseIndex:
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
      description: Allows a student to send a request to pause the exam. Requirems timeout atleast 30 seconds from client
      parameters:
        - in: query
          name: examID
          required: true
          schema:
            type: string
            format: given by professor
            example: vinuni-COMP2030-midterm-1
        - in: query
          name: studentID
          required: true
          schema:
            type: string
            example: V202200679
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
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
      parameters:
        - in: query
          name: examID
          required: true
          schema:
            type: string
            format: given by professor
            example: vinuni-COMP2030-midterm-1
        - in: query
          name: studentID
          required: true
          schema:
            type: string
            example: V202200679
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                activeStatus:
                  type: boolean
                  description: Whether the window of VsCode is active
                focusStatus:
                  type: boolean
                  description: Whether the window of VsCode is in focus
      responses:
        '200': 
          description: Lost focus notification received
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Student is not authorized (e.g., missing credentials, not in exam)
        '404':
          description: Exam not found
  /monitor/{examID}:
    get:
      tags:
        - teacher
      summary: .***WebSocket, not GET*** - Monitor students during exam
      description: Allows a teacher to monitor students during an exam. Add studentId (str) and acceptRq (bool) query when prof press accept for request. Timeout for professor reply is 30 seconds.
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: examID
          required: true
          schema:
            type: string
            format: given by professor
            example: vinuni-COMP2030-midterm-1

      responses:
        '200':
          description: WebSocket connection established, a stream of student data will be sent when student has an update. Only some updated information will be sent
          content:
            application/json:
              schema:
                type: object
                required:
                  - studentId
                properties:
                  studentId:
                    type: string
                    example: V202200679
                  joinedTime:
                    type: integer
                    format: Unix time
                    example: 1609459200
                  submitTime:
                    type: integer
                    example: 1609459200
                  gradings:
                    type: array
                    items:
                      type: object
                      properties:
                        time:
                          type: integer
                          example: 123
                        questionNb:
                          type: integer
                          example: 1
                        passedTestCases:
                          type: integer
                          example: 1
                        failedTestCases:
                          type: array
                          items:
                            type: object
                            properties:
                              testCaseIndex:
                                type: integer
                                example: 1
                              expectedOutput:
                                type: string
                                example: "expected output"
                              studentOutput:
                                type: string
                                example: "student output"
                  focusLostTime:
                    type: array
                    items:
                      type: integer
                      example: 1232
                  breakRqTime:
                    type: array
                    items:
                      type: object
                      properties:
                        breakRqTime:
                          type: integer
                          example: 1233
                        reason:
                          type: string
                          example: "pee"
                  finalSubmission:
                    type: array
                    items:
                      type: string
                      format: binary
                      example: "Q1.py"
        '400':
          description: 'invalid input, object invalid'
        '401':
          description: Teacher is not authorized to monitor the exam (e.g., missing credentials, not the exam creator)
        '404':
          description: Exam not found
      
components:
  securitySchemes:
    bearerAuth: 
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Exam:
      type: object
      required:
        - examID
        - examName
        - examStartTime
        - duration
        - password
      properties:
        examID:
          type: string
          format: assignment_name-order
          example: midterm-1
        examName:
          type: string
          example: Midterm 1
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
            type: array
            items:
              type: string
              format: binary
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