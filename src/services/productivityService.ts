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
  // Campos de Gamificación y Dashbaord
  daily_score: number;
  total_actions_today: number;
  contacts_today: number;
  follow_ups_today: number;
  presentations_today: number;
  posts_today: number;
  decisions_today: number;
  
  // Resúmenes Temporales
  active_days_week: number;
  total_actions_week: number;
  active_days_month: number;
  
  // Conversión
  presentations_total: number;
  decisions_total: number;
  
  // Datos mensuales para gráfica de tendencia (30 días)
  monthly_data: {
    date: string;
    day: number;
    points: number;
    score: number;
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
 * Obtener estadísticas de productividad (últimos 30 días para datos mensuales)
 */
export async function getProductivityStats(userId: string): Promise<ProductivityStats | null> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];

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
      weekly_data: [],
      daily_score: 0,
      total_actions_today: 0,
      contacts_today: 0,
      follow_ups_today: 0,
      presentations_today: 0,
      posts_today: 0,
      decisions_today: 0,
      active_days_week: 0,
      total_actions_week: 0,
      active_days_month: 0,
      presentations_total: 0,
      decisions_total: 0,
      monthly_data: []
    };
  }

  const today = new Date().toISOString().split("T")[0];
  
  // Filtrar datos de la última semana
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekStartDate = sevenDaysAgo.toISOString().split("T")[0];
  
  const weekData = data.filter(d => d.date >= weekStartDate);
  const todayData = data.find(d => d.date === today);

  // Calcular estadísticas generales (última semana, compatible con código anterior)
  const total_points = weekData.reduce((sum, day) => sum + (day.total_points || 0), 0);
  const days_active = weekData.length;
  const total_actions = weekData.reduce((sum, day) => {
    let actions = 0;
    if (day.contacted_prospects) actions++;
    if (day.did_followup) actions++;
    if (day.presented_business) actions++;
    if (day.posted_content) actions++;
    if (day.attended_training) actions++;
    return sum + actions;
  }, 0);
  const average_daily = days_active > 0 ? Math.round(total_actions / days_active) : 0;
  const best_day = Math.max(...weekData.map(d => d.total_points || 0));

  // Calcular racha actual
  const sortedDesc = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let current_streak = 0;
  
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
    
    const record = weekData.find(d => d.date === dateStr);
    weekly_data.push({
      day: dayName,
      points: record?.total_points || 0
    });
  }

  // Preparar datos mensuales (últimos 30 días) para gráfica de tendencia
  const monthly_data = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayNumber = date.getDate();
    
    const record = data.find(d => d.date === dateStr);
    const dayPoints = record?.total_points || 0;
    
    // Calcular score del día (mismo algoritmo que daily_score)
    const dayContacts = record?.contacted_prospects_count || (record?.contacted_prospects ? 1 : 0);
    const dayFollowups = record?.did_followup ? 1 : 0;
    const dayPresentations = record?.presented_business ? 1 : 0;
    const dayPosts = record?.posted_content ? 1 : 0;
    const dayDecisions = 0;
    
    const contactsScore = Math.min(dayContacts / 20, 1) * 30;
    const followupsScore = Math.min(dayFollowups / 10, 1) * 20;
    const presentationsScore = Math.min(dayPresentations / 3, 1) * 25;
    const postsScore = Math.min(dayPosts / 3, 1) * 10;
    const decisionsScore = Math.min(dayDecisions / 5, 1) * 15;
    
    const dayScore = Math.round(contactsScore + followupsScore + presentationsScore + postsScore + decisionsScore);
    
    monthly_data.push({
      date: dateStr,
      day: dayNumber,
      points: dayPoints,
      score: dayScore
    });
  }

  // CÁLCULOS DE GAMIFICACIÓN (NUEVO)

  // Datos de hoy
  const contacts_today = todayData?.contacted_prospects_count || (todayData?.contacted_prospects ? 1 : 0);
  const follow_ups_today = todayData?.did_followup ? 1 : 0; // Podría cambiarse a un count real si existe en DB
  const presentations_today = todayData?.presented_business ? 1 : 0;
  const posts_today = todayData?.posted_content ? 1 : 0;
  const decisions_today = 0; // TODO: Asignar a campo de DB
  
  const total_actions_today = contacts_today + follow_ups_today + presentations_today + posts_today + decisions_today;
  
  // Score de hoy (Fórmula simple basada en objetivos)
  // Objetivos: 20 contactos, 10 seguimientos, 3 presentaciones, 3 publicaciones, 5 decisiones
  const contactsScore = Math.min(contacts_today / 20, 1) * 30; // 30% peso
  const followupsScore = Math.min(follow_ups_today / 10, 1) * 20; // 20% peso
  const presentationsScore = Math.min(presentations_today / 3, 1) * 25; // 25% peso
  const postsScore = Math.min(posts_today / 3, 1) * 10; // 10% peso
  const decisionsScore = Math.min(decisions_today / 5, 1) * 15; // 15% peso
  
  const daily_score = Math.round(contactsScore + followupsScore + presentationsScore + postsScore + decisionsScore);

  // Datos de conversión y mes
  const active_days_month = data.length;
  
  const presentations_total = data.reduce((sum, day) => sum + (day.presented_business ? 1 : 0), 0);
  // Decisiones totales (Mock, requiere campo en DB para ser exacto)
  const decisions_total = Math.floor(presentations_total * 0.25); // ~25% conversión mockeada para prueba

  return {
    total_points,
    days_active,
    total_actions,
    average_daily,
    best_day,
    current_streak,
    weekly_data,
    daily_score,
    total_actions_today,
    contacts_today,
    follow_ups_today,
    presentations_today,
    posts_today,
    decisions_today,
    active_days_week: weekData.length,
    total_actions_week: total_actions,
    active_days_month,
    presentations_total,
    decisions_total,
    monthly_data
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