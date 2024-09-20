import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user data: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    const user = {
      id: data.id,
      displayName: data.display_name,
      email: data.email,
      images: data.images,
      country: data.country,
      product: data.product,
    };

    console.log("User data:", JSON.stringify(user, null, 2));

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
