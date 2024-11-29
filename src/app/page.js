'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /home when the component is mounted
    router.push('/search');
  }, [router]);

  return null; // Return null because the redirect happens immediately
}
