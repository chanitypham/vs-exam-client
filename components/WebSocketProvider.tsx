'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { sha256 } from 'js-sha256';

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
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'studentUpdate') {
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

  const monitorExam = useCallback((examId: string) => {
    if (socket && isConnected) {
      const email = 'hoang.vnh@vinuni.edu.vn'; // This should be dynamically set based on the logged-in user
      const randomNumber = Math.floor(Math.random() * 1000000);
      const authToken = sha256(email + randomNumber);

      socket.send(JSON.stringify({ 
        type: 'monitorExam', 
        examID: examId,
        profEmail: email,
        authToken: authToken
      }));
    } else {
      console.error('WebSocket is not connected. Unable to monitor exam.');
    }
  }, [socket, isConnected]);

  return (
    <WebSocketContext.Provider value={{ examData, studentData, monitorExam }}>
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
