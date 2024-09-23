'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SignOutButton } from '../components/SignOutButton';
import Image from 'next/image';

export type SpotifyUser = {
    id: string;
    displayName: string | null;
    email: string | null;
    images: Array<{
        url: string;
        height: number | null;
        width: number | null;
    }> | null;
    country?: string;
    product?: string;
};

export default function DashboardClient({ initialSpotifyUser }: { initialSpotifyUser: SpotifyUser | null }) {
    const { data: session, status } = useSession();
    const [spotifyUser] = useState(initialSpotifyUser);

    useEffect(() => {
        if (status === 'authenticated' && session?.error === 'RefreshTokenError') {
            signIn('spotify');
        }
    }, [session, status]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!spotifyUser) {
        return <div>Unable to load user data. Please try again later.</div>;
    }

    // Your dashboard content here
    return (
        <div>
            <h1>Dashboard</h1>
            <SignOutButton />
            <p>Your Spotify user name is: {spotifyUser?.displayName}</p>
            <p>Your Spotify pfp is: </p>
            <Image
                src={spotifyUser?.images?.[0]?.url ?? ""}
                alt="Spotify Profile Picture"
                width={100}
                height={100}
            />
        </div>
    )
}