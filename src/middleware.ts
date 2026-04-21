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
  
  // Dominio objetivo
  const targetDomain = "mwr.hubia.vip";
  
  // Si ya estamos en el dominio correcto, no hacer nada
  if (hostname.includes(targetDomain)) {
    return NextResponse.next();
  }
  
  // Lista de dominios temporales de Vercel que deben redirigir
  const shouldRedirect = 
    hostname.includes("viaja-ligero") && 
    hostname.includes("vercel.app");
  
  // Si viene de un dominio temporal de Vercel, redirigir al dominio principal
  if (shouldRedirect) {
    const url = request.nextUrl.clone();
    url.host = targetDomain;
    url.protocol = "https:";
    
    console.log(`[Middleware] Redirecting from ${hostname} to ${targetDomain}`);
    
    // Mantener toda la URL (path, query params, hash)
    return NextResponse.redirect(url, 308); // 308 = Permanent Redirect (mantiene método POST)
  }

  return NextResponse.next();
}

// Aplicar el middleware a todas las rutas (incluidas auth)
export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};