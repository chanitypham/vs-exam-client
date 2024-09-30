'use client'
import { useWebSocket } from '@/components/WebSocketProvider'
import ExamTable from '@/components/ExamTable'

export default function ExamPage({ params }: { params: { slug: string } }) {
  const { examData } = useWebSocket()
  const examId = params.slug

  return (
    <div className="container mx-auto p-4 ml-[200px]">
      <h1 className="text-3xl font-bold mb-4">Exam {examId}</h1>
      <ExamTable examId={examId} />
    </div>
  )
}
