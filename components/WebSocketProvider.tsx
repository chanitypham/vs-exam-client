'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

type ExamData = {
  [examId: string]: {
    studentId: string
    name: string
    joinedTime: number
    submitTime: number
    gradings: Array<{
      time: number
      questionNb: number
      passedTestCases: number
      failedTestCases: number
    }>
    focusLostTime: number[]
    breakRqTime: Array<{
      uniId: string
      courseId: string
      examId: string
      breakRqTime: number
      reason: string
    }>
    finalSubmission: string[]
  }[]
}

type WebSocketContextType = {
  examData: ExamData
  addExam: (uniId: string, courseId: string, examId: string, name: string, date: string) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  examData: {},
  addExam: () => {},
})

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [examData, setExamData] = useState<ExamData>({})
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://cloud.strixthekiet.me:8000/ws')
    setSocket(ws)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const fullExamId = `${data.uniId}-${data.courseId}-${data.examId}`
      setExamData(prevData => ({
        ...prevData,
        [fullExamId]: [...(prevData[fullExamId] || []), data]
      }))
    }

    return () => {
      ws.close()
    }
  }, [])

  const addExam = (uniId: string, courseId: string, examId: string, name: string, date: string) => {
    const fullExamId = `${uniId}${courseId}${examId}`
    setExamData(prevData => ({
      ...prevData,
      [fullExamId]: []
    }))
    if (socket) {
      socket.send(JSON.stringify({ type: 'addExam', uniId, courseId, examId, name, date }))
    }
  }

  return (
    <WebSocketContext.Provider value={{ examData, addExam }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)