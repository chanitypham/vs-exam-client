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

const BASE_URL = 'https://vsexam.cloud.strixthekiet.me';

export function ExamButton() {
  const [examName, setExamName] = useState('')
  const [examStartTime, setExamStartTime] = useState('')
  const [duration, setDuration] = useState('')
  const [uniId, setUniId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [examId, setExamId] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { addExam } = useWebSocket()

  const handleSubmit = async () => {
    if (examName && examStartTime && duration && uniId && courseId && examId && password) {
      const startTime = new Date(examStartTime).getTime()
      const durationMinutes = parseInt(duration)

      try {
        const response = await fetch(`${BASE_URL}/exam`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uniId,
            courseId,
            examId,
            examName,
            examStartTime: startTime,
            duration: durationMinutes,
            password,
          }),
        })

        if (response.ok) {
          addExam(uniId, courseId, examId, examName, startTime, durationMinutes, password)
          setIsOpen(false)
          // Reset form fields
          setExamName('')
          setExamStartTime('')
          setDuration('')
          setUniId('')
          setCourseId('')
          setExamId('')
          setPassword('')
        } else {
          console.error('Failed to create exam')
        }
      } catch (error) {
        console.error('Error creating exam:', error)
      }
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
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input 
              id="startTime" 
              type="datetime-local" 
              className="col-span-3" 
              value={examStartTime}
              onChange={(e) => setExamStartTime(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (minutes)
            </Label>
            <Input 
              id="duration" 
              type="number" 
              className="col-span-3" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input 
              id="password" 
              type="password" 
              className="col-span-3" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
