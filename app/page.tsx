'use client'
import { ExamButton } from '../components/ExamButton'
import { ExamList } from '../components/ExamList'
import { ExamTable } from '../components/ExamTable'
import { useEffect, useState } from 'react'
import { sha256 } from 'js-sha256';

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

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const email = 'hoang.vnh@vinuni.edu.vn'; // This should be dynamically set based on the logged-in user
        const randomNumber = Math.floor(Math.random() * 1000000);
        const authToken = sha256(email + randomNumber);

        const response = await fetch(`${BASE_URL}/exams?uniID=vinuni&courseID=COMP2030&profEmail=${email}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
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
  }, []);

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
