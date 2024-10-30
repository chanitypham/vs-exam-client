import { Badge } from "@/components/ui/badge"

interface Exam {
  profName: string;
  courseID: string;
  examName: string;
  examID: string;
  uniID: string;
  profEmail: string;
  examStartTime: number;
  duration: number;
  password: string;
  testCases: Array<Array<{ input: string; output: string }>>;
  materials: string[];
}

export function ExamDetails({ exam }: { exam: Exam }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{exam.examName}</h2>
        <p className="text-gray-600">Course: {exam.courseID}</p>
        <p className="text-gray-600">Professor: {exam.profName}</p>
      </div>
      <div className="flex space-x-4">
        <Badge>Start: {new Date(exam.examStartTime * 1000).toLocaleString()}</Badge>
        <Badge>Duration: {exam.duration} minutes</Badge>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Materials</h3>
        <ul className="list-disc list-inside">
          {exam.materials.map((item, index) => (
            <li key={index}>{item}</li>
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
