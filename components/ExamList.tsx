'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useWebSocket } from './WebSocketProvider'

export function ExamList() {
  const [isOpen, setIsOpen] = useState(false)
  const { examData } = useWebSocket()
  const exams = Object.keys(examData)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[200px] space-y-2 fixed left-0 top-0 h-full bg-gray-100"
    >
      <div className="flex items-center justify-between space-x-4 px-4 py-2">
        <h2 className="text-2xl font-semibold">Exams</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {exams.map((examId) => (
          <Link key={examId} href={`/exam/${examId}`}>
            <div className="rounded-md border px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <h3 className="text-lg font-medium">Exam {examId}</h3>
            </div>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
