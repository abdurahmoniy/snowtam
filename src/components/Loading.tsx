"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from 'next/link';




export default function Loading() {


    return (
        <div className="flex h-screen items-center justify-center min-w-[300px] max-w-[300px]">
            <DotLottieReact
                src="/loading-airplane.lottie"
                style={{ width: '100%', height: '100%' }}
                loop
                autoplay
                className='mb-2'
                
            />
        </div>
    );
}