'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWebSocket } from './WebSocketProvider'

export function ExamButton() {
  const [examName, setExamName] = useState('')
  const [examDate, setExamDate] = useState('')
  const [uniId, setUniId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [examId, setExamId] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { addExam } = useWebSocket()

  const handleSubmit = () => {
    if (examName && examDate && uniId && courseId && examId) {
      addExam(uniId, courseId, examId, examName, examDate)
      setExamName('')
      setExamDate('')
      setUniId('')
      setCourseId('')
      setExamId('')
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Exam</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Exam</DialogTitle>
          <DialogDescription>
            Enter the details for the new exam.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="uniId" className="text-right">
              University ID
            </Label>
            <Input 
              id="uniId" 
              className="col-span-3" 
              value={uniId}
              onChange={(e) => setUniId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courseId" className="text-right">
              Course ID
            </Label>
            <Input 
              id="courseId" 
              className="col-span-3" 
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="examId" className="text-right">
              Exam ID
            </Label>
            <Input 
              id="examId" 
              className="col-span-3" 
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              className="col-span-3" 
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input 
              id="date" 
              type="date" 
              className="col-span-3" 
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
