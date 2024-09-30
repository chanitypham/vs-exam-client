'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'
import { useWebSocket } from './WebSocketProvider'

type ExamDataItem = {
  studentId: string
  name: string
  joinedTime: number
  submitTime: number
  gradings: Array<{
    time: number
    questionNb: number
    passedTestCases: number
    failedTestCases: any[]
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
}

export default function ExamTable({ examId }: { examId: string }) {
  const { examData } = useWebSocket()
  const [highlightedRows, setHighlightedRows] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const newHighlightedRows: {[key: string]: string} = {}
      examData[examId]?.forEach(student => {
        const lastFocusLostTime = student.focusLostTime[student.focusLostTime.length - 1]
        if (lastFocusLostTime && now - lastFocusLostTime <= 5000) {
          newHighlightedRows[student.studentId] = 'bg-yellow-200'
        } else if (lastFocusLostTime && now - lastFocusLostTime > 5000) {
          newHighlightedRows[student.studentId] = 'bg-red-200'
        }
      })
      setHighlightedRows(newHighlightedRows)
    }, 1000)

    return () => clearInterval(timer)
  }, [examData, examId])

  const getStatus = (student: ExamDataItem) => {
    if (student.submitTime) return <Badge className="bg-green-500">Submitted</Badge>
    if (student.joinedTime) return <Badge className="bg-blue-500">In Exam</Badge>
    return <Badge className="bg-gray-500">Not Started</Badge>
  }

  const formatTime = (time: number) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined Time</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Break</TableHead>
          <TableHead>Out of Focus</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {examData[examId]?.map((student, index) => (
          <TableRow key={index} className={highlightedRows[student.studentId]}>
            <TableCell>{student.studentId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{formatTime(student.joinedTime)}</TableCell>
            <TableCell>
              <ul>
                {student.gradings.map((grading, idx) => (
                  <li key={idx}>
                    Q{grading.questionNb}: {grading.passedTestCases} passed at {formatTime(grading.time)}
                  </li>
                ))}
              </ul>
            </TableCell>
            <TableCell>{getStatus(student)}</TableCell>
            <TableCell>
              <ul>
                {student.breakRqTime.map((breakReq, idx) => (
                  <li key={idx}>
                    {formatTime(breakReq.breakRqTime)} - {breakReq.reason}
                  </li>
                ))}
              </ul>
            </TableCell>
            <TableCell>
              <ul>
                {student.focusLostTime.map((time, idx) => (
                  <li key={idx}>{formatTime(time)}</li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
