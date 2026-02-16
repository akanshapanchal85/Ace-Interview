import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
  return (
    <>
    <section className='card-cta'>
      <div className="flex flex-col gap-6">
          <h2 className="">Get AI Interview ready with practice and feedback!</h2>
          <p className="text-lg">Practice job interviews with AI and get feedback on your performance.</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
      </div>
      <Image src="/robot.png" alt="robot" width={500} height={500} className='max-sm:hidden'/>
    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>Your Interviews</h2>
      <div className='interviews-section'>
        <p>You haven&apos;t taken any interviews yet.</p>
      </div>
    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an Interview</h2>
      <div className='interviews-section'>
        <p>There are no interviews available at the moment.</p>
      </div>
    </section>
    </>
  );
};

export default Page;