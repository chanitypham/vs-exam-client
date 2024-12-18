'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { useAuth, useUser } from '@clerk/nextjs';
import { Exam } from '@/types/types';

const BASE_URL = 'https://vsexam.cloud.strixthekiet.me';

export function ExamList({ currentExamId }: { currentExamId?: string }) {
  const [exams, setExams] = useState<Exam[]>([])
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchExams = useCallback(async () => {
    try {
      const token = await getToken();
      const profEmail = user?.primaryEmailAddress?.emailAddress;
      const response = await fetch(`${BASE_URL}/exams?uniID=vinuni&courseID=COMP2030&profEmail=${profEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  }, [getToken, user]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

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
