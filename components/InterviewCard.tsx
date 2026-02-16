import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';
import DisplayTechIcons from './DisplayTechIcons';

type Feedback = {
  totalScore?: number;
  finalAssessment?: string;
};

type InterviewCardProps = {
  id: string;
  interviewId?: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  level: string;
  questions: string[];
  finalized: boolean;
  createdAt?: string | number | Date;
  feedback?: Feedback | null;
};

const InterviewCard= ({id, interviewId, userId, role, type, techstack, level, questions, finalized, createdAt, feedback = null} : InterviewCardProps) => {
    const resolvedInterviewId = interviewId ?? id;
    const normalizeType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(createdAt ?? Date.now()).format('MMM D, YYYY');
  return (
    <div className='card-border w-[360px] max-sm:w-full'>
        <div className='card-interview'>
            <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                <p className='badge-text'>{normalizeType}</p>
            </div>
            <Image src={getRandomInterviewCover()} alt="cover" width={90} height={90} className="rounded-full object-cover size-[90px]" />
            <h3 className='mt-5 capitalize'>{role} Interview</h3>
            <div className='flex flex-col gap-3 mt-3'>
              <div className='flex flex-row items-center gap-5'>
                <div className='flex flex-row items-center gap-2'>
                  <Image src="/calendar.svg" alt="date" width={22} height={22} />
                  <p>{formattedDate}</p>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <Image src="/star.svg" alt="score" width={22} height={22} />
                  <p>{feedback?.totalScore ?? '---'}/100</p>
                </div>
              </div>

              <p className='line-clamp-2'>
                {feedback?.finalAssessment ??
                  "You haven't taken this interview yet. Take it now to get feedback."}
              </p>
            </div>
                <div className='flex flex-row justify-between'>
                    <DisplayTechIcons techStack={techstack} />
                    <Button className='btn-primary'>
                        <Link href={feedback ? `/interview/${resolvedInterviewId}/feedback` : `/interview/${interviewId}`} >
                            {feedback ? 'View Feedback' : 'View Interview'}
                        </Link>
                    </Button>
                </div>
        </div>
    </div>
  )
}

export default InterviewCard;