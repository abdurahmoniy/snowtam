"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';

const Page = () => {
  return (
    <div className='flex justify-center items-center w-full h-full min-h-[90vh]'>
      <div className='max-w-[800px] max-h-[800px] h-full'>
        <DotLottieReact
          src="/404-animation.lottie"
          style={{ width: '100%', height: '100%' }}
          loop
          autoplay
          className='mb-2'
        />
        <div className='flex flex-col justify-center items-center '>
          <p className='text-3xl mb-2'>Bunday sahifa mavjud emas!</p>
         <div className='text-xl'>
           <Link  href='/' className='text-primary'>Bosh sahifaga qaytish</Link>
         </div>
        </div>
      </div>
    </div>
  );
};

export default Page