import { Badge } from "@/components/ui/badge"
import { Exam } from '@/types/types';

export function ExamDetails({ exam }: { exam: Exam }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{exam.examName}</h2>
        <p className="text-gray-600">Course: {exam.courseName}</p>
      </div>
      <div className="flex space-x-4">
        <Badge>Start: {new Date(exam.examStartTime * 1000).toLocaleString()}</Badge>
        <Badge>Duration: {exam.duration} minutes</Badge>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Materials</h3>
        <ul className="list-disc list-inside">
          {exam.material.map((item, index) => (
            <li key={index}>{item.fileName}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Test Cases</h3>
        <p>Number of questions: {exam.testCases.length}</p>
        {exam.testCases.map((question, qIndex) => (
          <div key={qIndex}>
            <p>Question {qIndex + 1}: {question.length} test cases</p>
          </div>
        ))}
      </div>
    </div>
  )
}
