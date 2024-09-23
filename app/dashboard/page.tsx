import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import { getCurrentUser } from '../lib/spotify';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  let spotifyUser = null;
  let error = null;

  if (session) {
    try {
      spotifyUser = await getCurrentUser();
    } catch (err) {
      console.error('Error fetching Spotify user:', err);
      error = (err as Error).message;
    }
  } else {
    error = "No session found";
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient initialSpotifyUser={spotifyUser} />
    </Suspense>
  );
}
