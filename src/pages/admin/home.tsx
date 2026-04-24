import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { referralService } from "@/services/referralService";
import { productivityService } from "@/services/productivityService";
import { 
  Home, Users, Calendar, Shield, Mail, Clock, Folder,
  TrendingUp, Phone, DollarSign, Target, MoreHorizontal,
  Plus, Search, Bell, CheckCircle2, Circle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  referred_by: string | null;
}

interface DashboardStats {
  leadsToday: number;
  commissionsMonth: number;
  activeProspects: number;
}

interface TodayActivity {
  id: string;
  title: string;
  type: "contact" | "followup" | "presentation" | "training";
  completed: boolean;
  comments?: number;
  assignedTo?: { name: string; avatar?: string }[];
}

interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  duration: string;
  type: "meeting" | "training" | "deadline";
}

export default function AdminHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    leadsToday: 0,
    commissionsMonth: 0,
    activeProspects: 0
  });
  const [activities, setActivities] = useState<TodayActivity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/admin");
        return;
      }

      const profileData = await authService.getUserProfile(session.user.id);
      if (!profileData) {
        router.push("/admin");
        return;
      }
      setProfile(profileData);

      // Load dashboard stats
      await loadDashboardStats(session.user.id);
      await loadTodayActivities(session.user.id);
      await loadCalendarEvents(session.user.id);

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const loadDashboardStats = async (userId: string) => {
    try {
      // Leads today
      const leads = await leadsService.getLeadsByUserId(userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const leadsToday = leads.filter(lead => {
        const leadDate = new Date(lead.created_at);
        leadDate.setHours(0, 0, 0, 0);
        return leadDate.getTime() === today.getTime();
      }).length;

      // Commissions this month
      const commissions = await referralService.getUserCommissions(userId);
      const commissionsMonth = commissions?.pending_amount || 0;

      // Active prospects (leads with status != converted)
      const activeProspects = leads.filter(
        lead => lead.status !== "converted"
      ).length;

      setStats({
        leadsToday,
        commissionsMonth,
        activeProspects
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadTodayActivities = async (userId: string) => {
    try {
      const leads = await leadsService.getLeadsByUserId(userId);
      const todayActivities: TodayActivity[] = [];

      // New leads to contact
      const newLeads = leads.filter(lead => lead.status === "nuevo").slice(0, 2);
      newLeads.forEach(lead => {
        todayActivities.push({
          id: `contact-${lead.id}`,
          title: `Contactar a ${lead.name}`,
          type: "contact",
          completed: false,
          comments: 0
        });
      });

      // Follow-ups needed
      const followupLeads = leads.filter(lead => lead.status === "contactado").slice(0, 2);
      followupLeads.forEach(lead => {
        todayActivities.push({
          id: `followup-${lead.id}`,
          title: `Seguimiento: ${lead.name}`,
          type: "followup",
          completed: false,
          comments: 0
        });
      });

      setActivities(todayActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const loadCalendarEvents = async (userId: string) => {
    // Mock events for now - can be enhanced with real calendar integration
    const mockEvents: CalendarEvent[] = [
      {
        id: "1",
        time: "8:00 am",
        title: "Daily Review",
        duration: "15min",
        type: "training"
      },
      {
        id: "2",
        time: "11:00 am",
        title: "Presentación - Cliente Nuevo",
        duration: "30min",
        type: "meeting"
      },
      {
        id: "3",
        time: "1:30 pm",
        title: "Seguimiento Equipo",
        duration: "45min",
        type: "meeting"
      }
    ];
    setEvents(mockEvents);
  };

  const toggleActivity = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const getActivityIcon = (type: TodayActivity["type"]) => {
    switch (type) {
      case "contact": return Phone;
      case "followup": return Mail;
      case "presentation": return Target;
      case "training": return TrendingUp;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-muted/30">
        <div className="w-20 bg-background border-r" />
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  const currentMonth = selectedDate.toLocaleDateString("es-ES", { month: "long" });
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="w-20 bg-background border-r flex flex-col items-center py-6 gap-6">
        <button
          onClick={() => router.push("/admin/home")}
          className="p-3 rounded-xl bg-primary text-primary-foreground"
        >
          <Home className="w-6 h-6" />
        </button>
        <button
          onClick={() => router.push("/admin/main-dashboard")}
          className="p-3 rounded-xl hover:bg-muted transition-colors"
        >
          <Users className="w-6 h-6" />
        </button>
        <button
          onClick={() => router.push("/admin/leads")}
          className="p-3 rounded-xl hover:bg-muted transition-colors"
        >
          <Calendar className="w-6 h-6" />
        </button>
        <button
          onClick={() => router.push("/admin/super-dashboard")}
          className="p-3 rounded-xl hover:bg-muted transition-colors"
        >
          <Shield className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-xl hover:bg-muted transition-colors">
          <Mail className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-xl hover:bg-muted transition-colors">
          <Clock className="w-6 h-6" />
        </button>
        <button
          onClick={() => router.push("/admin/recursos")}
          className="p-3 rounded-xl hover:bg-muted transition-colors"
        >
          <Folder className="w-6 h-6" />
        </button>
        <div className="mt-auto">
          <button className="p-3 rounded-xl hover:bg-muted transition-colors">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Quick Access</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted rounded-lg">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <Avatar>
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Quick Access + Tasks */}
            <div className="col-span-2 space-y-6">
              {/* Quick Access Cards */}
              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-[hsl(26,90%,60%)] to-[hsl(26,90%,50%)] text-white border-0">
                  <div className="flex items-start justify-between mb-4">
                    <Phone className="w-6 h-6" />
                    <button className="p-1 hover:bg-white/20 rounded">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-5xl font-bold mb-2">{stats.leadsToday}</div>
                  <div className="text-white/90">Leads Hoy</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-[hsl(250,75%,60%)] to-[hsl(250,75%,50%)] text-white border-0">
                  <div className="flex items-start justify-between mb-4">
                    <DollarSign className="w-6 h-6" />
                    <button className="p-1 hover:bg-white/20 rounded">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-5xl font-bold mb-2">${stats.commissionsMonth}</div>
                  <div className="text-white/90">Comisiones Mes</div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-[hsl(220,15%,20%)] to-[hsl(220,15%,15%)] text-white border-0">
                  <div className="flex items-start justify-between mb-4">
                    <Target className="w-6 h-6" />
                    <button className="p-1 hover:bg-white/20 rounded">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-5xl font-bold mb-2">{stats.activeProspects}</div>
                  <div className="text-white/90">Prospectos Activos</div>
                </Card>
              </div>

              {/* Today's Tasks */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Actividades de Hoy</h2>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No hay actividades pendientes para hoy
                    </p>
                  ) : (
                    activities.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <button
                            onClick={() => toggleActivity(activity.id)}
                            className="flex-shrink-0"
                          >
                            {activity.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-primary" />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground" />
                            )}
                          </button>
                          <IconComponent className="w-5 h-5 text-muted-foreground" />
                          <span className={`flex-1 ${activity.completed ? "line-through text-muted-foreground" : ""}`}>
                            {activity.title}
                          </span>
                          {activity.comments !== undefined && activity.comments > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{activity.comments}</span>
                            </div>
                          )}
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>

              {/* Team Efficiency Chart Placeholder */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Productividad del Equipo</h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm rounded-lg hover:bg-muted">Tiempo</button>
                    <button className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground">Tareas</button>
                    <button className="px-4 py-2 text-sm rounded-lg hover:bg-muted">Proyectos</button>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-4 px-4">
                  {[20, 25, 18, 30, 22, 28, 15].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1">
                        <div
                          className="flex-1 bg-primary/20 rounded-t-lg"
                          style={{ height: `${height * 3}px` }}
                        />
                        <div
                          className="flex-1 bg-secondary/60 rounded-t-lg"
                          style={{ height: `${(height + 5) * 3}px` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {["L", "M", "X", "J", "V", "S", "D"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Calendar */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Calendario</h2>
                  <button className="p-2 hover:bg-muted rounded-lg">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-lg font-semibold mb-4 capitalize">{currentMonth}</div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                      <div key={i} className="text-muted-foreground font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 4;
                      const isToday = day === 18;
                      const isCurrentMonth = day > 0 && day <= 31;
                      return (
                        <button
                          key={i}
                          className={`
                            aspect-square rounded-lg text-sm
                            ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                            ${!isCurrentMonth ? "text-muted-foreground/30" : "hover:bg-muted"}
                            ${day === 12 || day === 20 || day === 24 ? "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full" : ""}
                          `}
                        >
                          {isCurrentMonth ? day : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold mb-4">
                    18 May <span className="text-muted-foreground font-normal">({events.length} eventos)</span>
                  </div>
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{event.time}</div>
                          <div className="text-sm mb-1">{event.title}</div>
                          <div className="text-xs text-muted-foreground">{event.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}