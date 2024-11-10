export interface Exam {
  courseName: string;
  examID: string;
  examName: string;
  examStartTime: number;
  duration: number;
  password: string;
  testCases: Array<Array<{ input: string; output: string }>>;
  material: { fileName: string; materialContent: string }[];
  attendingStudents: Array<{
    studentID: string;
    joinedTime: number;
    submitTime: number;
    gradings: Array<{
      time: number;
      questionNb: number;
      passedTestCases: number;
      failedTestCases: Array<{
        testCaseIndex: number;
        expectedOutput: string;
        studentOutput: string;
      }>;
    }>;
    focusLostTime: number[];
    breakRqTime: Array<{
      breakRqTime: number;
      reason: string;
    }>;
    finalSubmission: string[];
  }>;
  profName: string;
  courseID: string;
  uniID: string;
  profEmail: string;
  materials: string[];
}

export interface TestCase {
  input: any; 
  output: any;
}

export interface ExamData {
  [examId: string]: {
    courseName: string;
    examID: string;
    examName: string;
    examStartTime: number;
    duration: number;
    password: string;
    testCases: TestCase[];
    material: { fileName: string; materialContent: string }[];
  };
}

export interface StudentData {
  [studentId: string]: {
    joinedTime: number;
    submitTime: number;
    gradings: {
      time: number;
      questionNb: number;
      passedTestCases: number;
      failedTestCases: {
        testCaseIndex: number;
        expectedOutput: string;
        studentOutput: string;
      }[];
    }[];
    focusLostTime: number[];
    breakRqTime: { breakRqTime: number; reason: string }[];
    finalSubmission: string[];
  };
}

export interface WebSocketContextType {
  examData: ExamData;
  studentData: StudentData;
  monitorExam: (examId: string) => Promise<void>;
  handleBreakRequest: (studentId: string, accept: boolean) => void;
}