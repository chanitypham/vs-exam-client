'use client'
import { ExamButton } from '../components/ExamButton'
import { ExamList } from '../components/ExamList'
import { ExamTable } from '../components/ExamTable'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs';

interface Exam {
  courseName: string;
  examID: string;
  examName: string;
  examStartTime: number;
  duration: number;
  password: string;
  testCases: any[];
  material: { fileName: string; materialContent: string }[];
}

const BASE_URL = 'https://vsexam.cloud.strixthekiet.me';

export default function Home() {
  const [exams, setExams] = useState<Exam[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/exams?uniID=vinuni&courseID=COMP2030`, {
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
    };

    fetchExams();
  }, [getToken]);

  return (
    <div className="flex">
      <ExamList />
      <div className="flex-grow ml-[200px] p-4">
        <h1 className="text-3xl font-bold mb-4">Exam Dashboard</h1>
        <ExamButton />
        <ExamTable exams={exams} />
      </div>
    </div>
  )
}
