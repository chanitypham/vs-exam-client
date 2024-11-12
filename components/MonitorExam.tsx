import { Exam } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function MonitorExam({ exam }: { exam: Exam }) {
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
          {exam.attendingStudents && exam.attendingStudents.map((student) => (
            <TableRow key={student.studentID}>
              <TableCell>{student.studentID}</TableCell>
              <TableCell>{new Date(student.joinedTime * 1000).toLocaleString()}</TableCell>
              <TableCell>{student.submitTime ? new Date(student.submitTime * 1000).toLocaleString() : 'Not submitted'}</TableCell>
              <TableCell>
                {student.gradings.length > 0 ? student.gradings.map((grading, index) => (
                  <Badge key={index} className="mr-1">
                    Q{grading.questionNb}: {grading.passedTestCases}/{grading.passedTestCases + grading.failedTestCases.length}
                  </Badge>
                )) : 'No gradings yet'}
              </TableCell>
              <TableCell>{student.focusLostTime.length}</TableCell>
              <TableCell>{student.breakRqTime.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

