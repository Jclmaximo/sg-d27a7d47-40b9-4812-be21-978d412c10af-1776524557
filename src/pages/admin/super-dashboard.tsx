import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { Users, DollarSign, TrendingUp, UserCheck, Search, ArrowLeft, Power, PowerOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface UserWithSubscription {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  ambassador_active: boolean;
  created_at: string;
  subscription: {
    id: string;
    status: string;
    price_usd: number;
    start_date: string;
    end_date: string;
    discount_code_used: string | null;
  } | null;
  lead_count: number;
}

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalLeads: number;
}

export default function SuperDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSubscription[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalLeads: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, statusFilter, users]);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive"
      });
      router.push("/admin/dashboard");
      return;
    }

    await loadData();
  };

  const loadData = async () => {
    try {
      // Get all profiles with their subscriptions
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          full_name,
          username,
          ambassador_active,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get subscriptions
      const { data: subscriptionsData, error: subsError } = await supabase
        .from("subscriptions")
        .select("*");

      if (subsError) throw subsError;

      // Get lead counts per user
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("user_id");

      if (leadsError) throw leadsError;

      // Count leads per user
      const leadCounts = leadsData.reduce((acc: Record<string, number>, lead) => {
        if (lead.user_id) {
          acc[lead.user_id] = (acc[lead.user_id] || 0) + 1;
        }
        return acc;
      }, {});

      // Combine data
      const usersWithSubs: UserWithSubscription[] = profilesData.map(profile => {
        const subscription = subscriptionsData.find(sub => sub.user_id === profile.id);
        return {
          ...profile,
          subscription: subscription || null,
          lead_count: leadCounts[profile.id] || 0
        };
      });

      setUsers(usersWithSubs);

      // Calculate stats
      const activeCount = subscriptionsData.filter(sub => sub.status === "active").length;
      const totalRev = subscriptionsData.reduce((sum, sub) => sum + (sub.price_usd || 0), 0);

      setStats({
        totalUsers: profilesData.length,
        activeSubscriptions: activeCount,
        totalRevenue: totalRev,
        totalLeads: leadsData.length
      });

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => {
        if (statusFilter === "active") return user.subscription?.status === "active";
        if (statusFilter === "inactive") return !user.subscription || user.subscription.status !== "active";
        if (statusFilter === "ambassador") return user.ambassador_active;
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  const toggleAmbassadorStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ambassador_active: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Estado Actualizado",
        description: `Ambassador ${!currentStatus ? "activado" : "desactivado"} exitosamente`
      });

      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Super Admin Dashboard - Viaja Ligero" description="Panel de administración principal" />
      
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Gestión completa de usuarios y suscripciones
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registrados en la plataforma</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Ambassadors activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Revenue generado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeads}</div>
                <p className="text-xs text-muted-foreground">Capturados por todos</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Usuarios y Suscripciones</CardTitle>
              <CardDescription>Gestiona todos los usuarios de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email, nombre o username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Suscripción Activa</SelectItem>
                    <SelectItem value="inactive">Sin Suscripción</SelectItem>
                    <SelectItem value="ambassador">Ambassadors Activos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Suscripción</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Vigencia</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Ambassador</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No se encontraron usuarios
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.full_name || "Sin nombre"}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.username ? (
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {user.username}
                              </code>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.subscription ? (
                              <Badge variant={user.subscription.status === "active" ? "default" : "secondary"}>
                                {user.subscription.status}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Sin suscripción</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.subscription ? (
                              <div>
                                <div className="font-medium">{formatCurrency(user.subscription.price_usd)}</div>
                                {user.subscription.discount_code_used && (
                                  <div className="text-xs text-muted-foreground">
                                    Cupón: {user.subscription.discount_code_used}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.subscription ? (
                              <div className="text-sm">
                                <div>{formatDate(user.subscription.start_date)}</div>
                                <div className="text-muted-foreground">
                                  hasta {formatDate(user.subscription.end_date)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.lead_count}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.ambassador_active ? "default" : "outline"}>
                              {user.ambassador_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAmbassadorStatus(user.id, user.ambassador_active)}
                            >
                              {user.ambassador_active ? (
                                <PowerOff className="h-4 w-4 text-destructive" />
                              ) : (
                                <Power className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}