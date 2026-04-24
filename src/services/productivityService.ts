import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProductivityRecord = Database["public"]["Tables"]["user_productivity"]["Row"];
type ProductivityInsert = Database["public"]["Tables"]["user_productivity"]["Insert"];
type ProductivityUpdate = Database["public"]["Tables"]["user_productivity"]["Update"];

export interface DailyActivity {
  contacted_prospects: boolean;
  contacted_prospects_count: number;
  did_followup: boolean;
  presented_business: boolean;
  posted_content: boolean;
  attended_training: boolean;
}

export interface ProductivityStats {
  total_points: number;
  days_active: number;
  total_actions: number;
  average_daily: number;
  best_day: number;
  current_streak: number;
  weekly_data: {
    day: string;
    points: number;
  }[];
}

export interface TeamMemberStats {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  percentage: number;
  days_active: number;
  total_points: number;
  last_activity: string;
  status: "active" | "medium" | "low" | "inactive";
}

/**
 * Obtener o crear registro de productividad del día actual
 */
export async function getTodayProductivity(userId: string): Promise<ProductivityRecord | null> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("user_productivity")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (error) {
    console.error("Error fetching today's productivity:", error);
    return null;
  }

  return data;
}

/**
 * Guardar actividad del día
 */
export async function saveDailyActivity(
  userId: string,
  activity: DailyActivity
): Promise<{ success: boolean; data?: ProductivityRecord; error?: string }> {
  const today = new Date().toISOString().split("T")[0];

  // Intentar actualizar primero
  const { data: existing } = await supabase
    .from("user_productivity")
    .select("id")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    // Actualizar registro existente
    const { data, error } = await supabase
      .from("user_productivity")
      .update({
        contacted_prospects: activity.contacted_prospects,
        contacted_prospects_count: activity.contacted_prospects_count,
        did_followup: activity.did_followup,
        presented_business: activity.presented_business,
        posted_content: activity.posted_content,
        attended_training: activity.attended_training
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating productivity:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } else {
    // Crear nuevo registro
    const { data, error } = await supabase
      .from("user_productivity")
      .insert({
        user_id: userId,
        date: today,
        contacted_prospects: activity.contacted_prospects,
        contacted_prospects_count: activity.contacted_prospects_count,
        did_followup: activity.did_followup,
        presented_business: activity.presented_business,
        posted_content: activity.posted_content,
        attended_training: activity.attended_training
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating productivity:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }
}

/**
 * Obtener estadísticas de productividad (últimos 7 días)
 */
export async function getProductivityStats(userId: string): Promise<ProductivityStats | null> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = sevenDaysAgo.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("user_productivity")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching productivity stats:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return {
      total_points: 0,
      days_active: 0,
      total_actions: 0,
      average_daily: 0,
      best_day: 0,
      current_streak: 0,
      weekly_data: []
    };
  }

  // Calcular estadísticas
  const total_points = data.reduce((sum, day) => sum + (day.total_points || 0), 0);
  const days_active = data.length;
  const total_actions = data.reduce((sum, day) => {
    let actions = 0;
    if (day.contacted_prospects) actions++;
    if (day.did_followup) actions++;
    if (day.presented_business) actions++;
    if (day.posted_content) actions++;
    if (day.attended_training) actions++;
    return sum + actions;
  }, 0);
  const average_daily = days_active > 0 ? Math.round(total_actions / days_active) : 0;
  const best_day = Math.max(...data.map(d => d.total_points || 0));

  // Calcular racha actual
  const sortedDesc = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let current_streak = 0;
  const today = new Date().toISOString().split("T")[0];
  
  for (let i = 0; i < sortedDesc.length; i++) {
    const recordDate = sortedDesc[i].date;
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split("T")[0];
    
    if (recordDate === expectedDateStr) {
      current_streak++;
    } else {
      break;
    }
  }

  // Preparar datos semanales (últimos 7 días)
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekly_data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = dayNames[date.getDay()];
    
    const record = data.find(d => d.date === dateStr);
    weekly_data.push({
      day: dayName,
      points: record?.total_points || 0
    });
  }

  return {
    total_points,
    days_active,
    total_actions,
    average_daily,
    best_day,
    current_streak,
    weekly_data
  };
}

/**
 * Obtener estadísticas del equipo (solo para admins)
 */
export async function getTeamProductivityStats(): Promise<TeamMemberStats[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = sevenDaysAgo.toISOString().split("T")[0];

  // Obtener todos los usuarios con su productividad
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url");

  if (profilesError || !profiles) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  // Obtener productividad de todos los usuarios
  const { data: productivity, error: prodError } = await supabase
    .from("user_productivity")
    .select("*")
    .gte("date", startDate);

  if (prodError) {
    console.error("Error fetching team productivity:", prodError);
    return [];
  }

  // Agrupar por usuario y calcular stats
  const userStats: TeamMemberStats[] = profiles.map(profile => {
    const userRecords = productivity?.filter(p => p.user_id === profile.id) || [];
    
    const days_active = userRecords.length;
    const total_points = userRecords.reduce((sum, r) => sum + (r.total_points || 0), 0);
    const percentage = Math.round((days_active / 7) * 100);
    
    // Encontrar última actividad
    const sortedRecords = [...userRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let last_activity = "Sin actividad";
    if (sortedRecords.length > 0) {
      const lastDate = new Date(sortedRecords[0].date);
      const today = new Date();
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) last_activity = "Hoy";
      else if (diffDays === 1) last_activity = "Ayer";
      else if (diffDays < 7) last_activity = `Hace ${diffDays} días`;
      else last_activity = "Hace más de 1 semana";
    }
    
    // Determinar estado
    let status: TeamMemberStats["status"];
    if (percentage >= 80) status = "active";
    else if (percentage >= 50) status = "medium";
    else if (percentage >= 20) status = "low";
    else status = "inactive";
    
    return {
      user_id: profile.id,
      full_name: profile.full_name || "Usuario",
      avatar_url: profile.avatar_url,
      percentage,
      days_active,
      total_points,
      last_activity,
      status
    };
  });

  // Ordenar por porcentaje descendente
  return userStats.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Obtener top 5 del equipo
 */
export async function getTopTeamMembers(): Promise<TeamMemberStats[]> {
  const allStats = await getTeamProductivityStats();
  return allStats.slice(0, 5);
}