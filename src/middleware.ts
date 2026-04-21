import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware para redirigir todas las URLs temporales de Vercel 
 * al dominio personalizado mwr.hubia.vip
 * 
 * Esto asegura que los emails de Supabase (que usan las URLs de Vercel)
 * redirijan automáticamente al dominio correcto manteniendo todos los
 * parámetros (tokens, query params, etc.)
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Lista de dominios temporales de Vercel que deben redirigir al dominio principal
  const vercelDomains = [
    "viaja-ligero-7rfmim235-maximo1.vercel.app",
    "viaja-ligero-mwr-git-main-maximo1.vercel.app",
    "viaja-ligero-mwr.vercel.app",
  ];

  // Si viene de un dominio temporal de Vercel, redirigir al dominio principal
  if (vercelDomains.some(domain => hostname.includes(domain))) {
    url.host = "mwr.hubia.vip";
    url.protocol = "https:";
    
    // Mantener toda la URL (path, query params, hash)
    return NextResponse.redirect(url, 301); // 301 = Permanent redirect
  }

  return NextResponse.next();
}

// Aplicar el middleware a todas las rutas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};