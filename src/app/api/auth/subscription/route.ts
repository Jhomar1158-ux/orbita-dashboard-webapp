import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    // Obtener el ID de usuario de la consulta
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    // Obtener información de suscripción
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        credits_remaining,
        is_active,
        subscription_packages:package_id (
          id,
          name,
          is_premium,
          features
        )
      `
      )
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError) {
      console.error("Error al obtener suscripción:", subscriptionError);
      return NextResponse.json(
        { message: "Error al obtener la suscripción" },
        { status: 500 }
      );
    }

    // Devolver la información de suscripción
    return NextResponse.json({
      subscription: subscriptionData
        ? {
            id: subscriptionData.subscription_packages.id,
            name: subscriptionData.subscription_packages.name,
            is_premium: subscriptionData.subscription_packages.is_premium,
            features: subscriptionData.subscription_packages.features,
            credits_remaining: subscriptionData.credits_remaining,
          }
        : null,
    });
  } catch (error) {
    console.error("Error obteniendo suscripción:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error en el servidor",
      },
      { status: 500 }
    );
  }
}
