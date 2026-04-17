import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { Users, DollarSign, TrendingUp, UserCheck, Search, ArrowLeft, Power, PowerOff, Wallet, CheckCircle, XCircle, LogOut } from "lucide-react";
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

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount_usd: number;
  wallet_address: string;
  status: string;
  requested_at: string;
  paid_at: string | null;
  notes: string | null;
  user: {
    email: string;
    full_name: string | null;
    username: string | null;
  };
}

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalLeads: number;
  pendingWithdrawals: number;
  pendingAmount: number;
}

export default function SuperDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSubscription[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalLeads: 0,
    pendingWithdrawals: 0,
    pendingAmount: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState<string>("pending");

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

    if (profile?.role !== "super_admin") {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente"
    });
    router.push("/admin");
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

      // Get withdrawal requests with user info
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from("withdrawal_requests")
        .select(`
          id,
          user_id,
          amount_usd,
          wallet_address,
          status,
          requested_at,
          paid_at,
          notes,
          user:profiles(email, full_name, username)
        `)
        .order("requested_at", { ascending: false });

      if (withdrawalsError) throw withdrawalsError;

      // Format withdrawal requests
      const formattedWithdrawals: WithdrawalRequest[] = withdrawalsData.map((w: any) => ({
        id: w.id,
        user_id: w.user_id,
        amount_usd: w.amount_usd,
        wallet_address: w.wallet_address,
        status: w.status,
        requested_at: w.requested_at,
        paid_at: w.paid_at,
        notes: w.notes,
        user: Array.isArray(w.user) ? w.user[0] : w.user
      }));

      setWithdrawalRequests(formattedWithdrawals);

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
      const pendingWithdrawals = formattedWithdrawals.filter(w => w.status === "pending");
      const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount_usd, 0);

      setStats({
        totalUsers: profilesData.length,
        activeSubscriptions: activeCount,
        totalRevenue: totalRev,
        totalLeads: leadsData.length,
        pendingWithdrawals: pendingWithdrawals.length,
        pendingAmount
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

  const updateWithdrawalStatus = async (withdrawalId: string, newStatus: "paid" | "rejected", notes?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === "paid") {
        updateData.paid_at = new Date().toISOString();
      }

      if (notes) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from("withdrawal_requests")
        .update(updateData)
        .eq("id", withdrawalId);

      if (error) throw error;

      toast({
        title: "✅ Actualizado",
        description: `Solicitud marcada como ${newStatus === "paid" ? "pagada" : "rechazada"}`
      });

      await loadData();
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getFilteredWithdrawals = () => {
    if (withdrawalStatusFilter === "all") return withdrawalRequests;
    return withdrawalRequests.filter(w => w.status === withdrawalStatusFilter);
  };

  const downloadPendingWithdrawalsCSV = () => {
    // Filter only pending withdrawals
    const pendingWithdrawals = withdrawalRequests.filter(w => w.status === "pending");

    if (pendingWithdrawals.length === 0) {
      toast({
        title: "Sin solicitudes pendientes",
        description: "No hay solicitudes de retiro pendientes para descargar",
        variant: "destructive"
      });
      return;
    }

    // Generate CSV content
    const csvContent = pendingWithdrawals
      .map(w => `${w.wallet_address},${w.amount_usd.toFixed(2)}`)
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `retiros-pendientes-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "✅ CSV Descargado",
      description: `${pendingWithdrawals.length} solicitud(es) exportadas exitosamente`
    });
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
            <div className="flex items-center justify-between mb-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
            <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Gestión completa de usuarios, suscripciones y retiros
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retiros Pendientes</CardTitle>
                <Wallet className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingWithdrawals}</div>
                <p className="text-xs text-muted-foreground">Total: {formatCurrency(stats.pendingAmount)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Users and Withdrawals */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Usuarios y Suscripciones</TabsTrigger>
              <TabsTrigger value="withdrawals">
                Solicitudes de Retiro
                {stats.pendingWithdrawals > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.pendingWithdrawals}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
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
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals">
              <Card>
                <CardHeader>
                  <CardTitle>💰 Solicitudes de Retiro</CardTitle>
                  <CardDescription>Gestiona las solicitudes de retiro de comisiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Select value={withdrawalStatusFilter} onValueChange={setWithdrawalStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="paid">Pagados</SelectItem>
                        <SelectItem value="rejected">Rechazados</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      onClick={downloadPendingWithdrawalsCSV}
                      disabled={withdrawalRequests.filter(w => w.status === "pending").length === 0}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Descargar CSV (Pendientes)
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Billetera USDT (BSC)</TableHead>
                          <TableHead>Solicitado</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredWithdrawals().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No hay solicitudes de retiro
                            </TableCell>
                          </TableRow>
                        ) : (
                          getFilteredWithdrawals().map((withdrawal) => (
                            <TableRow key={withdrawal.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {withdrawal.user.full_name || "Sin nombre"}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {withdrawal.user.email}
                                  </div>
                                  {withdrawal.user.username && (
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                      @{withdrawal.user.username}
                                    </code>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-lg">
                                  {formatCurrency(withdrawal.amount_usd)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                                  {withdrawal.wallet_address}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(withdrawal.requested_at)}
                                </div>
                                {withdrawal.paid_at && (
                                  <div className="text-xs text-muted-foreground">
                                    Pagado: {formatDate(withdrawal.paid_at)}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    withdrawal.status === "paid"
                                      ? "default"
                                      : withdrawal.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {withdrawal.status === "paid"
                                    ? "Pagado"
                                    : withdrawal.status === "pending"
                                    ? "Pendiente"
                                    : "Rechazado"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {withdrawal.status === "pending" && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => updateWithdrawalStatus(withdrawal.id, "paid")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Pagado
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateWithdrawalStatus(withdrawal.id, "rejected")}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Rechazar
                                    </Button>
                                  </div>
                                )}
                                {withdrawal.status !== "pending" && (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}