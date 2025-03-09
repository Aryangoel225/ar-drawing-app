"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get('id');

    const checkFileStatus = async (id: string) => {
        const response = await fetch(`http://sktchpd.services.dylankainth.com/checkfile/${id}`);
        const data = await response.json();
        return data.pending;
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (id) {
                const isPending = await checkFileStatus(id);
                if (!isPending) {
                    clearInterval(interval);
                    router.push(`/output/${id}`);
                }
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [id, router]);

    return (
        <p>processing</p>
    );
}

