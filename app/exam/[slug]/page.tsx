'use client'
import { useEffect } from 'react'
import { ExamList } from '@/components/ExamList'
import { ExamDetails } from '@/components/ExamDetails'
import { MonitorExam } from '@/components/MonitorExam'
import { useWebSocket } from '@/components/WebSocketProvider'

export default function ExamPage({ params }: { params: { slug: string } }) {
  const examId = params.slug
  const { examData, monitorExam } = useWebSocket()

  useEffect(() => {
    monitorExam(examId);
  }, [examId, monitorExam]);

  const exam = examData[examId];

  return (
    <div className="flex">
      <ExamList currentExamId={examId} />
      <div className="flex-grow ml-[200px] p-4">
        <h1 className="text-3xl font-bold mb-4">Exam {examId}</h1>
        {exam ? (
          <>
            <ExamDetails exam={exam} />
            <div className="mt-8">
              <MonitorExam examId={examId} />
            </div>
          </>
        ) : (
          <p>Loading exam details...</p>
        )}
      </div>
    </div>
  )
}
