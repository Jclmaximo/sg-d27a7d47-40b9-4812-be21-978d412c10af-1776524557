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
 * Obtener estadísticas de productividad del equipo (solo referidos del usuario)
 */
export async function getTeamProductivityStats(userId: string): Promise<TeamMemberStats[]> {
  try {
    // Primero obtener todos los IDs del equipo del usuario (referidos directos)
    // Para no complicar con funciones SQL no tipeadas, hacemos una consulta simple por ahora
    const { data: directReferrals, error: teamError } = await supabase
      .from("profiles")
      .select("id")
      .eq("referred_by", userId);

    if (teamError || !directReferrals || directReferrals.length === 0) {
      console.log("No team members found or error:", teamError);
      return [];
    }

    const teamIds = directReferrals.map(r => r.id);
    
    // Aquí podríamos hacer más consultas para obtener nivel 2, 3, etc.
    // Por ahora obtenemos las estadísticas de los directos

    return getProductivityStatsForUsers(teamIds);
  } catch (error) {
    console.error("Error in getTeamProductivityStats:", error);
    return [];
  }
}

/**
 * Obtener estadísticas de productividad para una lista de usuarios
 */
async function getProductivityStatsForUsers(userIds: string[]): Promise<TeamMemberStats[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data, error } = await supabase
    .from("user_productivity")
    .select(`
      user_id,
      date,
      total_points,
      profiles!user_productivity_user_id_fkey(full_name, avatar_url)
    `)
    .in("user_id", userIds)
    .gte("date", startDate.toISOString().split("T")[0])
    .lte("date", endDate.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching team productivity:", error);
    return [];
  }

  const userStats = new Map<string, TeamMemberStats>();

  userIds.forEach(userId => {
    userStats.set(userId, {
      user_id: userId,
      full_name: "Usuario",
      avatar_url: undefined,
      total_points: 0,
      days_active: 0,
      percentage: 0,
      last_activity: "Sin actividad",
      status: "inactive"
    });
  });

  data?.forEach((record: any) => {
    const userId = record.user_id;
    const stats = userStats.get(userId);
    
    if (stats) {
      stats.full_name = record.profiles?.full_name || "Usuario";
      stats.avatar_url = record.profiles?.avatar_url || undefined;
      stats.total_points += record.total_points || 0;
      if (record.total_points > 0) {
        stats.days_active += 1;
      }
    }
  });

  const statsArray = Array.from(userStats.values());

  statsArray.forEach(stats => {
    stats.percentage = Math.round((stats.days_active / 7) * 100);
    
    if (stats.percentage >= 80) {
      stats.status = "active";
    } else if (stats.percentage >= 50) {
      stats.status = "medium";
    } else {
      stats.status = "inactive";
    }

    if (stats.days_active > 0) {
      const daysSince = 7 - stats.days_active;
      if (daysSince === 0) {
        stats.last_activity = "Hoy";
      } else if (daysSince === 1) {
        stats.last_activity = "Hace 1 día";
      } else {
        stats.last_activity = `Hace ${daysSince} días`;
      }
    }
  });

  return statsArray.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Obtener top 5 del equipo
 */
export async function getTopTeamMembers(userId: string): Promise<TeamMemberStats[]> {
  const allStats = await getTeamProductivityStats(userId);
  return allStats.slice(0, 5);
}

export const productivityService = {
  getTodayProductivity,
  saveDailyActivity,
  getProductivityStats,
  getTeamProductivityStats,
  getTopTeamMembers
};