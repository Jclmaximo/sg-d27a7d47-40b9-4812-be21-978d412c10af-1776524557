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
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // DEBUG: Log every request to see if middleware is running
  console.log("🔍 MIDDLEWARE HIT:", {
    pathname,
    search: request.nextUrl.search,
    fullUrl: request.url
  });

  // CRÍTICO: Redirigir /mwr?ref=username a /invitaunamigo?ref=username
  // Esta regla debe ejecutarse PRIMERO, antes de cualquier otra lógica
  if (pathname === "/mwr") {
    console.log("✅ MATCHED /mwr pathname");
    const ref = request.nextUrl.searchParams.get("ref");
    console.log("📍 REF PARAM:", ref);
    
    if (ref) {
      const url = new URL("/invitaunamigo", request.url);
      url.searchParams.set("ref", ref);
      console.log("🔀 REDIRECTING TO:", url.toString());
      return NextResponse.redirect(url, 307);
    } else {
      console.log("⚠️ NO REF PARAM - Not redirecting");
    }
  }

  const hostname = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  
  // DEBUG: Log SIEMPRE para ver qué está llegando
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Hostname:", hostname);
  console.log("Path:", path);
  console.log("Search:", search);
  console.log("Full URL:", request.url);
  
  // Dominio objetivo
  const targetDomain = "mwr.hubia.vip";
  
  // Si ya estamos en el dominio correcto, no hacer nada
  if (hostname === targetDomain || hostname.startsWith(targetDomain)) {
    console.log("✅ Already on target domain, no redirect needed");
    return NextResponse.next();
  }
  
  // Detectar si es una URL de Vercel que necesita redirect
  const isVercelURL = hostname.includes("vercel.app");
  
  console.log("Is Vercel URL?", isVercelURL);
  
  // Si viene de cualquier URL de Vercel, redirigir al dominio principal
  if (isVercelURL) {
    const url = request.nextUrl.clone();
    url.host = targetDomain;
    url.protocol = "https:";
    
    const redirectTo = url.toString();
    console.log("🔀 REDIRECTING TO:", redirectTo);
    
    // 308 = Permanent Redirect (mantiene método POST)
    return NextResponse.redirect(url, 308);
  }

  console.log("⚠️ No redirect conditions met, continuing...");
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