'use client'
import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useWebSocket } from './WebSocketProvider'

// const BASE_URL = 'https://vsexam.cloud.strixthekiet.me';

export default function ExamTable({ examId }: { examId: string }) {
  const { examData } = useWebSocket()
  const [highlightedRows, setHighlightedRows] = useState<{ [key: string]: 'yellow' | 'red' | null }>({})

  const formatTime = (time: number) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not started":
        return <Badge variant="secondary">Not Started</Badge>
      case "in exam":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">In Exam</Badge>
      case "submitted":
        return <Badge variant="outline" className="text-green-600 border-green-600">Submitted</Badge>
      default:
        return null
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const newHighlightedRows = { ...highlightedRows }

      examData[examId]?.forEach(student => {
        const recentFocusLoss = student.focusLostTime.find(lossTime => 
          now - lossTime <= 5000
        )

        const longFocusLoss = student.focusLostTime.some(lossTime => 
          now - lossTime > 5000
        )

        if (longFocusLoss) {
          newHighlightedRows[student.studentId] = 'red'
        } else if (recentFocusLoss) {
          newHighlightedRows[student.studentId] = 'yellow'
        } else {
          newHighlightedRows[student.studentId] = null
        }
      })

      setHighlightedRows(newHighlightedRows)
    }, 1000)

    return () => clearInterval(interval)
  }, [examData, examId, highlightedRows])

  if (!examData[examId]) {
    return <div>No data available for this exam.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined Time</TableHead>
          <TableHead>Submit Time</TableHead>
          <TableHead>Gradings</TableHead>
          <TableHead>Focus Lost Times</TableHead>
          <TableHead>Break Requests</TableHead>
          <TableHead>Final Submission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {examData[examId].map((student, index) => (
          <TableRow 
            key={index}
            className={cn(
              highlightedRows[student.studentId] === 'yellow' && "bg-yellow-100",
              highlightedRows[student.studentId] === 'red' && "bg-red-100"
            )}
          >
            <TableCell>{student.studentId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{getStatusBadge(student.submitTime ? "submitted" : "in exam")}</TableCell>
            <TableCell>{formatTime(student.joinedTime)}</TableCell>
            <TableCell>{student.submitTime ? formatTime(student.submitTime) : "Not submitted"}</TableCell>
            <TableCell>
              {student.gradings.map((grading, idx) => (
                <div key={idx}>
                  Q{grading.questionNb}: {grading.passedTestCases} passed at {formatTime(grading.time)}
                </div>
              ))}
            </TableCell>
            <TableCell>
              {student.focusLostTime.map((lossTime, idx) => (
                <div key={idx}>
                  {formatTime(lossTime)}
                </div>
              ))}
            </TableCell>
            <TableCell>
              {student.breakRqTime.map((breakReq, idx) => (
                <div key={idx}>
                  {formatTime(breakReq.breakRqTime)} - {breakReq.reason}
                </div>
              ))}
            </TableCell>
            <TableCell>
              {student.finalSubmission.join(', ')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
