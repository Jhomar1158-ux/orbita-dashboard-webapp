import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { message: "Logged out" },
    { status: 200 }
  );
  response.cookies.delete("has_completed_onboarding");
  response.cookies.delete("is_logged_in");
  return response;
}
