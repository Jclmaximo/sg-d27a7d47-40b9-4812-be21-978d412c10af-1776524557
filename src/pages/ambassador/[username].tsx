import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";

export default function AmbassadorPage() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    // Redirect to leads-registro with ref parameter
    if (username && typeof username === "string") {
      router.replace(`/leads-registro?ref=${username}`);
    }
  }, [username, router]);

  // Show nothing while redirecting
  return (
    <>
      <SEO 
        title="Viaja Ligero - Redirigiendo..."
        description="Redirigiendo a tu experiencia personalizada"
      />
      <div className="min-h-screen flex items-center justify-center bg-[#1A1F3A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4FD1C5] mx-auto mb-4"></div>
          <p className="text-white/70">Redirigiendo...</p>
        </div>
      </div>
    </>
  );
}