# Orbita Dashboard Web App

## Configuración de Supabase para Autenticación

Para utilizar la autenticación con Supabase, debes configurar un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
# Supabase - Solo para uso en servidor
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-clave-de-servicio-secreta
```

> **Importante**: Todas las conexiones a Supabase se realizan exclusivamente desde el servidor para mayor seguridad.

### Pasos para configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com) si aún no tienes una
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia las URLs y la clave de servicio (Service Role Key)
4. Crea la tabla `users_profile` con la siguiente estructura:

```sql
create table users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  instruction_category text,
  instruction_option text,
  region text,
  province text,
  created_at timestamp with time zone default now()
);

-- Configurar RLS (Row Level Security)
alter table users_profile enable row level security;

-- Crear políticas para acceso
create policy "Los usuarios pueden ver sus propios perfiles"
  on users_profile for select
  using (auth.uid() = id);

create policy "Los usuarios pueden actualizar sus propios perfiles"
  on users_profile for update
  using (auth.uid() = id);
```

## Desarrollo

Para iniciar el entorno de desarrollo:

```bash
npm run dev
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
