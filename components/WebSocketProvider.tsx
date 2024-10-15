'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ExamData {
  [examId: string]: {
    courseName: string;
    examID: string;
    examName: string;
    examStartTime: number;
    duration: number;
    password: string;
    testCases: any[];
    material: { fileName: string; materialContent: string }[];
  };
}

interface StudentData {
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

interface WebSocketContextType {
  examData: ExamData;
  studentData: StudentData;
  createExam: (examInfo: any) => void;
  monitorExam: (examId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [examData, setExamData] = useState<ExamData>({});
  const [studentData, setStudentData] = useState<StudentData>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://vsexam.cloud.strixthekiet.me/');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'getExams', uniID: 'vinuni', profID: 'COMP2030', email: 'hoang.vnh@vinuni.edu.vn' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'exams') {
        setExamData(data.exams);
      } else if (data.type === 'examCreated') {
        setExamData(prevExams => ({
          ...prevExams,
          [data.exam.examID]: data.exam
        }));
      } else if (data.type === 'studentUpdate') {
        setStudentData((prev) => ({ ...prev, [data.studentId]: data }));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const createExam = useCallback((examInfo: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ 
        type: 'createExam', 
        uniID: 'vinuni',
        courseID: examInfo.courseID,
        email: 'hoang.vnh@vinuni.edu.vn',
        examInfo 
      }));
    } else {
      console.error('WebSocket is not connected. Unable to create exam.');
    }
  }, [socket, isConnected]);

  const monitorExam = useCallback((examId: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({ 
        type: 'monitorExam', 
        examID: examId,
        email: 'hoang.vnh@vinuni.edu.vn'
      }));
    } else {
      console.error('WebSocket is not connected. Unable to monitor exam.');
    }
  }, [socket, isConnected]);

  return (
    <WebSocketContext.Provider value={{ examData, studentData, createExam, monitorExam }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
