'use client'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
    focusLostTime: [1621235067890, 1621236067890],
    breakRqTime: [
      { breakRqTime: 1621236567890, reason: "Bathroom break" }
    ],
    finalSubmission: ["Q1.py", "Q2.py"]
  },
  // Add more hard-coded student data as needed
]

export default function ExamTable({ examId }: { examId: string }) {
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
          <TableHead>Submit Time</TableHead>
          <TableHead>Gradings</TableHead>
          <TableHead>Focus Lost Times</TableHead>
          <TableHead>Break Requests</TableHead>
          <TableHead>Final Submission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hardCodedData.map((student, index) => (
          <TableRow key={index}>
            <TableCell>{student.studentId}</TableCell>
            <TableCell>{student.name}</TableCell>
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
              {student.focusLostTime.map((time, idx) => (
                <div key={idx}>{formatTime(time)}</div>
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
