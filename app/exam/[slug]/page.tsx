'use client'
import ExamTable from '@/components/ExamTable'
import { ExamList } from '@/components/ExamList'

export default function ExamPage({ params }: { params: { slug: string } }) {
  const examId = params.slug

  return (
    <div className="flex">
      <ExamList currentExamId={examId} />
      <div className="flex-grow ml-[200px] p-4">
        <h1 className="text-3xl font-bold mb-4">Exam {examId}</h1>
        <ExamTable examId={examId} />
      </div>
    </div>
  )
}