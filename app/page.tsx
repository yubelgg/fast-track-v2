"use client";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
            className="shadow-primary w-30 h-10 rounded-md bg-white border-0 text-black text-lg active:scale-[0.99]"
          >
            Sign In
          </button>
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="tracking-tighter font-bold text-4xl">
          Transform Your Spotify into Endless Discovery.
        </div>
        <div className="max-w-screen-md text-lg">
          With millions of songs out there, finding the right ones can feel
          overwhelming. That’s where we come in. By analyzing your Spotify
          playlists, we create a personalized feed of music recommendations that
          suits your style, mood, and musical preferences.
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/yubelgg/fast-track-v2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/github-mark-white.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          repo
        </a>
      </footer>
    </div>
  );
}
