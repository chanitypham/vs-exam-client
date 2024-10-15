'use client'
import { ExamButton } from '../components/ExamButton'
import { ExamList } from '../components/ExamList'
import { ExamTable } from '../components/ExamTable'
import { useWebSocket } from '../components/WebSocketProvider'

export default function Home() {
  const { examData } = useWebSocket();

  return (
    <div className="flex">
      <ExamList />
      <div className="flex-grow ml-[200px] p-4">
        <h1 className="text-3xl font-bold mb-4">Exam Dashboard</h1>
        <ExamButton />
        <ExamTable exams={Object.values(examData)} />
      </div>
    </div>
  )
}
