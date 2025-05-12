import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error("Error de autenticación:", error);
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const { data: profileData, error: profileError } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error al obtener perfil:", profileError);
    }

    // Obtener información básica del paquete de suscripción
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        credits_remaining,
        is_active,
        package_id,
        subscription_packages:package_id (
          id,
          name,
          is_premium
        )
      `
      )
      .eq("user_id", data.user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError) {
      console.error("Error al obtener suscripción:", subscriptionError);
    }

    const response = NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profileData?.name || "",
        profileData: profileData || undefined,
        subscription: subscriptionData
          ? {
              id: subscriptionData.package_id,
              packageName: subscriptionData.subscription_packages?.name,
              isPremium: subscriptionData.subscription_packages?.is_premium,
              creditsRemaining: subscriptionData.credits_remaining,
            }
          : undefined,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });

    response.cookies.set("has_completed_onboarding", "true", {
      path: "/",
      maxAge: 31536000,
      httpOnly: true,
    });

    response.cookies.set("is_logged_in", "true", {
      path: "/",
      maxAge: 432000,
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error en el servidor",
      },
      { status: 500 }
    );
  }
}
