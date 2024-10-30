'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sha256 } from 'js-sha256';

const BASE_URL = 'https://vsexam.cloud.strixthekiet.me';

export function ExamButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [examInfo, setExamInfo] = useState({
    examID: '',
    examName: '',
    examStartTime: '',
    duration: '',
    password: '',
    courseID: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExamInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const email = 'hoang.vnh@vinuni.edu.vn'; 
      const randomNumber = Math.floor(Math.random() * 1000000);
      const authToken = sha256(email + randomNumber);

      const response = await fetch(`${BASE_URL}/exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          uniID: 'vinuni',
          profEmail: email,
          ...examInfo,
        })
      });
      if (!response.ok) throw new Error('Failed to create exam');
      setIsOpen(false)
      setExamInfo({
        examID: '',
        examName: '',
        examStartTime: '',
        duration: '',
        password: '',
        courseID: '',
      })
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Exam</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Exam</DialogTitle>
          <DialogDescription>
            Fill in the exam details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examID" className="text-right">
                Exam ID
              </Label>
              <Input
                id="examID"
                name="examID"
                value={examInfo.examID}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examName" className="text-right">
                Exam Name
              </Label>
              <Input
                id="examName"
                name="examName"
                value={examInfo.examName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examStartTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="examStartTime"
                name="examStartTime"
                type="datetime-local"
                value={examInfo.examStartTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={examInfo.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={examInfo.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseID" className="text-right">
                Course ID
              </Label>
              <Input
                id="courseID"
                name="courseID"
                value={examInfo.courseID}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
