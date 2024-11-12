'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ExamData, StudentData, WebSocketContextType } from '@/types/types';

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [examData, setExamData] = useState<ExamData>({});
  const [studentData, setStudentData] = useState<StudentData>({});
  const [isConnected, setIsConnected] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const ws = new WebSocket('ws://vsexam.cloud.strixthekiet.me/');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'examUpdate') {
        setExamData((prev) => ({ ...prev, [data.examID]: data }));
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

  const monitorExam = useCallback(async (examId: string) => {
    if (socket && isConnected) {
      const token = await getToken();
      socket.send(JSON.stringify({ 
        type: 'monitorExam', 
        examID: examId,
        profEmail: 'hoang.vnh@vinuni.edu.vn', 
        authToken: token
      }));
    } else {
      console.error('WebSocket is not connected. Unable to monitor exam.');
    }
  }, [socket, isConnected, getToken]);

  const handleBreakRequest = useCallback((studentId: string, accept: boolean) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'breakResponse',
        studentID: studentId,
        acceptRq: accept
      }));
    } else {
      console.error('WebSocket is not connected. Unable to handle break request.');
    }
  }, [socket, isConnected]);

  return (
    <WebSocketContext.Provider value={{ examData, studentData, monitorExam, handleBreakRequest }}>
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
