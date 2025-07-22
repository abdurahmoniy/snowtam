

// src/app/protected/page.tsx
import { redirect } from 'next/navigation';

export default async function HomeRedirection() {
    redirect('/home');
}