import { SignOutButton } from "../components/SignOutButton";
import { getCurrentUser } from "../lib/spotify";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Dashboard() {
  const spotifyUser = await getCurrentUser();

  if (!spotifyUser) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <SignOutButton />
      <p>Your Spotify user name is: {spotifyUser.displayName}</p>
      <p>Your Spotify pfp is: </p>
      {spotifyUser.images && spotifyUser.images[0] && (
        <Image
          src={spotifyUser.images[0].url}
          alt="Spotify Profile Picture"
          width={100}
          height={100}
        />
      )}
    </div>
  );
}
