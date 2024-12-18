import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Exam } from '@/types/types';

export function ExamTable({ exams }: { exams: Exam[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exam Name</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam) => (
          <TableRow key={exam.examID}>
            <TableCell>
              <Link href={`/exam/${exam.examID}`} className="text-blue-600 hover:underline">
                {exam.examName}
              </Link>
            </TableCell>
            <TableCell>{exam.courseName}</TableCell>
            <TableCell>{new Date(exam.examStartTime * 1000).toLocaleString()}</TableCell>
            <TableCell>{exam.duration} minutes</TableCell>
            <TableCell>
              <Badge>
                {new Date(exam.examStartTime * 1000) > new Date() ? 'Upcoming' : 
                 new Date(exam.examStartTime * 1000).getTime() + exam.duration * 60000 > Date.now() ? 'In Progress' : 'Finished'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
