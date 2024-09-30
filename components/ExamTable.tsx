/* eslint-disable */
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

const hardCodedData = [
  {
    studentId: "S001",
    name: "John Doe",
    joinedTime: 1621234567890,
    submitTime: 1621238167890,
    gradings: [
      { time: 1621235567890, questionNb: 1, passedTestCases: 3 },
      { time: 1621236567890, questionNb: 2, passedTestCases: 2 },
    ],
    focusLostDurations: [
      { startTime: 1621235067890, duration: 3000 },  // 3 seconds
      { startTime: 1621236067890, duration: 7000 },  // 7 seconds
    ],
    breakRqTime: [
      { breakRqTime: 1621236567890, reason: "Bathroom break" }
    ],
    finalSubmission: ["Q1.py", "Q2.py"],
    status: "in exam" // Can be "not started", "in exam", or "submitted"
  },
]

export default function ExamTable({ examId }: { examId: string }) {
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

      hardCodedData.forEach(student => {
        const recentFocusLoss = student.focusLostDurations.find(loss => 
          now - (loss.startTime + loss.duration) <= 5000 && loss.duration <= 5000
        )

        const longFocusLoss = student.focusLostDurations.some(loss => loss.duration > 5000)

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
  }, [highlightedRows])

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
          <TableHead>Focus Lost Durations</TableHead>
          <TableHead>Break Requests</TableHead>
          <TableHead>Final Submission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hardCodedData.map((student, index) => (
          <TableRow 
            key={index}
            className={cn(
              highlightedRows[student.studentId] === 'yellow' && "bg-yellow-100",
              highlightedRows[student.studentId] === 'red' && "bg-red-100"
            )}
          >
            <TableCell>{student.studentId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{getStatusBadge(student.status)}</TableCell>
            <TableCell>{formatTime(student.joinedTime)}</TableCell>
            <TableCell>{formatTime(student.submitTime)}</TableCell>
            <TableCell>
              {student.gradings.map((grading, idx) => (
                <div key={idx}>
                  Q{grading.questionNb}: {grading.passedTestCases} passed at {formatTime(grading.time)}
                </div>
              ))}
            </TableCell>
            <TableCell>
              {student.focusLostDurations.map((loss, idx) => (
                <div key={idx}>
                  {formatTime(loss.startTime)}: {loss.duration / 1000}s
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
