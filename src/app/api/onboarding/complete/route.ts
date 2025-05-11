import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Onboarding completado con éxito",
      },
      { status: 200 }
    );

    response.cookies.set("has_completed_onboarding", "true", {
      path: "/",
      maxAge: 31536000,
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error("Error al establecer cookie de onboarding:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al completar onboarding",
      },
      { status: 500 }
    );
  }
}
