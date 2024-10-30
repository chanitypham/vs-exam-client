'use client'
import { useEffect, useState } from 'react'
import { ExamList } from '@/components/ExamList'
import { ExamDetails } from '@/components/ExamDetails'
import { MonitorExam } from '@/components/MonitorExam'
import { sha256 } from 'js-sha256';

interface Exam {
  courseName: string;
  examID: string;
  examName: string;
  examStartTime: number;
  duration: number;
  password: string;
  testCases: Array<Array<{ input: string; output: string }>>;
  material: { fileName: string; materialContent: string }[];
  attendingStudents: Array<{
    studentID: string;
    joinedTime: number;
    submitTime: number;
    gradings: any[];
    focusLostTimes: any[];
    breakRqTimes: any[];
    finalSubmission: any[];
  }>;
  profName: string;
  courseID: string;
  uniID: string;
  profEmail: string;
  materials: string[]; 
}


const BASE_URL = 'https://vsexam.cloud.strixthekiet.me';

export default function ExamPage({ params }: { params: { slug: string } }) {
  const examId = params.slug
  const [exam, setExam] = useState<Exam | null>(null)

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const email = 'hoang.vnh@vinuni.edu.vn'; // This should be dynamically set based on the logged-in user
        const randomNumber = Math.floor(Math.random() * 1000000);
        const authToken = sha256(email + randomNumber);

        const url = `${BASE_URL}/exam?examID=${examId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch exam details');

        const examData: Exam = await response.json();
        setExam(examData);
      } catch (error) {
        console.error('Error fetching exam details:', error);
      }
    };

    fetchExamDetails();
  }, [examId]);

  return (
    <div className="flex">
      <ExamList currentExamId={examId} />
      <div className="flex-grow ml-[200px] p-4">
        <h1 className="text-3xl font-bold mb-4">Exam {examId}</h1>
        {exam ? (
          <>
            <ExamDetails exam={exam} />
            <div className="mt-8">
              <MonitorExam exam={exam} />
            </div>
          </>
        ) : (
          <p>Loading exam details...</p>
        )}
      </div>
    </div>
  )
}
