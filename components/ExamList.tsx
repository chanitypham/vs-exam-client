'use client'
import Link from 'next/link'
import { useWebSocket } from './WebSocketProvider'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"

export function ExamList({ currentExamId }: { currentExamId?: string }) {
  const { examData } = useWebSocket()
  const exams = Object.values(examData)

  return (
    <div className="w-[200px] fixed left-0 top-0 h-full bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Exams</h2>
      <div className="space-y-2">
        {exams.map((exam) => (
          <Link key={exam.examID} href={`/exam/${exam.examID}`} className="block mb-2">
            <Button
              variant={currentExamId === exam.examID ? "secondary" : "outline"}
              className={cn(
                "w-full justify-start text-left",
                currentExamId === exam.examID && "bg-blue-200 hover:bg-blue-200"
              )}
            >
              {exam.examName}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
