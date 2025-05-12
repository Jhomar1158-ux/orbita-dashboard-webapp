import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json(
        { message: "Datos incompletos para el registro" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      console.error("Error de autenticación:", authError);
      throw new Error(
        authError?.message || "Error al crear la cuenta de usuario"
      );
    }

    const { error: dbError } = await supabase.from("users_profile").insert({
      id: authData.user.id,
      name: userData.name,
      age: userData.age,
      instruction_category: userData.instruction.category,
      instruction_option: userData.instruction.option || null,
      region: userData.location.region,
      province: userData.location.province,
    });

    if (dbError) {
      console.error("Error de base de datos:", dbError);
      throw new Error(
        dbError.message || "Error al guardar el perfil de usuario"
      );
    }

    // Obtener el ID del paquete freemium
    const { data: freemiumPackage, error: packageError } = await supabase
      .from("subscription_packages")
      .select("id")
      .eq("name", "Freemium")
      .single();

    if (packageError || !freemiumPackage) {
      console.error("Error al obtener paquete freemium:", packageError);
      // Continuamos el registro aunque haya un error con el paquete
    } else {
      // Asignar el paquete freemium al usuario
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: authData.user.id,
          package_id: freemiumPackage.id,
          credits_remaining: 0,
          is_active: true,
        });

      if (subscriptionError) {
        console.error("Error al asignar paquete freemium:", subscriptionError);
        // Continuamos el registro aunque haya un error con la suscripción
      }
    }

    const response = NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    );

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
    console.error("Error en registro:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error en el servidor",
      },
      { status: 500 }
    );
  }
}
