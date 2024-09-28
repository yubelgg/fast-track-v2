import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const body = await request.json();
    const { song_id } = body;

    const { stdout, stderr } = await execAsync(
      `python app/api/recommendation/recommend.py ${song_id}`,
    );

    if (stderr) {
      console.error("Python script error:", stderr);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const recommendations = JSON.parse(stdout);

    return new Response(JSON.stringify(recommendations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in recommendation API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
