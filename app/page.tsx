import { ExamButton } from '@/components/ExamButton'
import { ExamList } from '@/components/ExamList'
import { WebSocketProvider } from '@/components/WebSocketProvider'

export default function Home() {
  return (
    <WebSocketProvider>
      <div className="flex">
        <ExamList />
        <div className="flex-grow ml-[200px] p-4">
          <h1 className="text-3xl font-bold mb-4">Exam Dashboard</h1>
          <ExamButton />
        </div>
      </div>
    </WebSocketProvider>
  )
}
