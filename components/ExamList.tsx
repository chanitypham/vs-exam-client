'use client'
import Link from 'next/link'
import { useWebSocket } from './WebSocketProvider'
import { cn } from '@/lib/utils'

export function ExamList({ currentExamId }: { currentExamId?: string }) {
  const { examData } = useWebSocket()
  const exams = Object.keys(examData)

  // Add some hard-coded exams
  const allExams = [...exams, 'exam-1', 'exam-2', 'exam-3']

  return (
    <div className="w-[200px] fixed left-0 top-0 h-full bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Exams</h2>
      <div className="space-y-2">
        {allExams.map((examId) => (
          <Link key={examId} href={`/exam/${examId}`}>
            <div className={cn(
              "rounded-md border px-4 py-2 hover:bg-gray-200 cursor-pointer",
              currentExamId === examId && "bg-blue-200 hover:bg-blue-300"
            )}>
              <h3 className="text-lg font-medium">Exam {examId}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}