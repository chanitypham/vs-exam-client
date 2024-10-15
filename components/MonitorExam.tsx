'use client'
import { useEffect } from 'react'
import { useWebSocket } from './WebSocketProvider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function MonitorExam({ examId }: { examId: string }) {
  const { studentData, monitorExam } = useWebSocket()

  useEffect(() => {
    monitorExam(examId)
  }, [examId, monitorExam])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Student Monitor</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Joined Time</TableHead>
            <TableHead>Submit Time</TableHead>
            <TableHead>Gradings</TableHead>
            <TableHead>Focus Lost Count</TableHead>
            <TableHead>Break Requests</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(studentData).map(([studentId, data]) => (
            <TableRow key={studentId}>
              <TableCell>{studentId}</TableCell>
              <TableCell>{new Date(data.joinedTime).toLocaleString()}</TableCell>
              <TableCell>{data.submitTime ? new Date(data.submitTime).toLocaleString() : 'Not submitted'}</TableCell>
              <TableCell>
                {data.gradings.map((grading, index) => (
                  <Badge key={index} className="mr-1">
                    Q{grading.questionNb}: {grading.passedTestCases}/{grading.passedTestCases + grading.failedTestCases.length}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>{data.focusLostTime.length}</TableCell>
              <TableCell>{data.breakRqTime.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
