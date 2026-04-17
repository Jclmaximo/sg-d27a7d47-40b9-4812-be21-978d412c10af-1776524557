import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { referralService, type Commission, type NetworkStats, type ReferralTreeNode } from "@/services/referralService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { 
  LayoutDashboard, 
  Users, 
  Network, 
  Link2, 
  Settings, 
  LogOut, 
  Copy, 
  Check, 
  DollarSign, 
  TrendingUp, 
  MessageSquare,
  ExternalLink,
  Wallet,
  User,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  interest_level: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  whatsapp_number: string;
  usdt_wallet_address: string | null;
  role: string;
  ambassador_active: boolean;
}

export default function MainDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // User profile
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [interestFilter, setInterestFilter] = useState<string>("all");
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  
  // Network
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [tree, setTree] = useState<ReferralTreeNode | null>(null);
  
  // Links
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  
  // Wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [searchTerm, statusFilter, interestFilter, leads]);

  const loadAllData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setWalletAddress(profileData.usdt_wallet_address || "");
    }

    // Load leads
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("captured_by", user.id)
      .order("created_at", { ascending: false });

    if (leadsData) {
      setLeads(leadsData);
    }

    // Load network data
    const [statsData, commissionsData, treeData] = await Promise.all([
      referralService.getNetworkStats(user.id),
      referralService.getUserCommissions(user.id),
      referralService.getReferralTree(user.id, 2)
    ]);

    setStats(statsData);
    setCommissions(commissionsData);
    setTree(treeData);
    setLoading(false);
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.whatsapp.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (interestFilter !== "all") {
      filtered = filtered.filter(lead => lead.interest_level === interestFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente"
    });
    router.push("/admin");
  };

  const copyFunnelLink = () => {
    if (!profile?.username) return;
    const link = `${window.location.origin}/ambassador/${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopiedFunnel(true);
    toast({
      title: "✅ Link copiado",
      description: "El link de tu embudo ha sido copiado al portapapeles"
    });
    setTimeout(() => setCopiedFunnel(false), 2000);
  };

  const copyReferralLink = () => {
    if (!profile?.username) return;
    const link = `${window.location.origin}/pricing?ref=${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopiedReferral(true);
    toast({
      title: "✅ Link copiado",
      description: "Tu link de referidos ha sido copiado al portapapeles"
    });
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const saveWalletAddress = async () => {
    if (!profile) return;

    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una dirección válida",
        variant: "destructive"
      });
      return;
    }

    setSavingWallet(true);

    const { error } = await supabase
      .from("profiles")
      .update({ usdt_wallet_address: walletAddress })
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la billetera",
        variant: "destructive"
      });
    } else {
      toast({
        title: "✅ Guardado",
        description: "Tu billetera USDT ha sido actualizada"
      });
      setProfile({ ...profile, usdt_wallet_address: walletAddress });
    }

    setSavingWallet(false);
  };

  const requestWithdrawal = async () => {
    if (!profile?.usdt_wallet_address) {
      toast({
        title: "Configura tu billetera",
        description: "Primero debes agregar tu dirección de billetera USDT (BSC)",
        variant: "destructive"
      });
      return;
    }

    if (!stats || stats.available_balance < 39.50) {
      toast({
        title: "Saldo insuficiente",
        description: "Necesitas al menos $39.50 USD para solicitar un retiro",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("withdrawal_requests")
      .insert({
        user_id: profile.id,
        amount_usd: stats.available_balance,
        wallet_address: profile.usdt_wallet_address,
        status: "pending"
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud de retiro",
        variant: "destructive"
      });
    } else {
      toast({
        title: "✅ Solicitud creada",
        description: `Se procesará tu retiro de $${stats.available_balance.toFixed(2)} USD`
      });
      await loadAllData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando dashboard...</p>
      </div>
    );
  }

  const funnelUrl = profile?.username ? `${window.location.origin}/ambassador/${profile.username}` : "";
  const referralUrl = profile?.username ? `${window.location.origin}/pricing?ref=${profile.username}` : "";

  return (
    <>
      <SEO 
        title="Mi Dashboard - Viaja Ligero"
        description="Panel de control para gestionar leads, red de referidos y comisiones"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Mi Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Bienvenido, {profile?.full_name}
                </p>
              </div>
              <div className="flex gap-2">
                {profile?.role === "admin" && (
                  <Link href="/admin/super-dashboard">
                    <Button variant="outline" size="sm">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Super Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-4 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span className="hidden sm:inline">Mi Red</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Links</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1 - OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leads.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Capturados por tu embudo
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mi Red</CardTitle>
                    <Network className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_referrals || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Referidos activos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats?.total_earned.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total ganado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disponible</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats?.available_balance.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Para retirar
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>
                    Herramientas para hacer crecer tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setActiveTab("links")}
                  >
                    <Link2 className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Compartir Embudo</div>
                      <div className="text-xs text-muted-foreground">
                        Copia tu link personalizado
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setActiveTab("leads")}
                  >
                    <Users className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Ver Leads</div>
                      <div className="text-xs text-muted-foreground">
                        {leads.length} prospectos capturados
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2 - LEADS */}
            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Leads Capturados</CardTitle>
                  <CardDescription>
                    Gestiona todos los prospectos que han completado tu embudo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="new">Nuevos</SelectItem>
                        <SelectItem value="contacted">Contactados</SelectItem>
                        <SelectItem value="qualified">Calificados</SelectItem>
                        <SelectItem value="converted">Convertidos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay leads que coincidan con tu búsqueda</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Interés</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLeads.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="font-medium">{lead.full_name}</TableCell>
                              <TableCell>{lead.email}</TableCell>
                              <TableCell>{lead.whatsapp}</TableCell>
                              <TableCell>{lead.country}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  lead.interest_level === "both" ? "default" :
                                  lead.interest_level === "earn" ? "secondary" :
                                  "outline"
                                }>
                                  {lead.interest_level === "both" ? "Ambas" :
                                   lead.interest_level === "earn" ? "Ganar" : "Ahorrar"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  lead.status === "converted" ? "default" :
                                  lead.status === "qualified" ? "secondary" :
                                  "outline"
                                }>
                                  {lead.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(lead.created_at).toLocaleDateString("es-ES")}
                              </TableCell>
                              <TableCell>
                                <a
                                  href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="sm" variant="ghost">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3 - NETWORK */}
            <TabsContent value="network" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Ganado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${stats?.total_earned.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disponible para Retiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${stats?.available_balance.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Referidos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.total_referrals || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historial de Comisiones</CardTitle>
                  <CardDescription>
                    Comisiones ganadas del 50% por cada referido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {commissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aún no has ganado comisiones</p>
                      <p className="text-sm mt-2">Comparte tu link de referidos para empezar a ganar</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Referido</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {commissions.map((commission) => (
                            <TableRow key={commission.id}>
                              <TableCell>{commission.referred_username}</TableCell>
                              <TableCell className="font-medium">
                                ${commission.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  commission.status === "paid" ? "default" :
                                  commission.status === "pending" ? "secondary" :
                                  "outline"
                                }>
                                  {commission.status === "paid" ? "Pagado" :
                                   commission.status === "pending" ? "Pendiente" : "Disponible"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(commission.created_at).toLocaleDateString("es-ES")}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Retiro</CardTitle>
                  <CardDescription>
                    Retiros mínimos de $39.50 USD a tu billetera USDT (BSC)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={requestWithdrawal}
                    disabled={!stats || stats.available_balance < 39.50}
                    size="lg"
                    className="w-full"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Solicitar Retiro de ${stats?.available_balance.toFixed(2) || "0.00"}
                  </Button>
                  {stats && stats.available_balance < 39.50 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Necesitas ${(39.50 - stats.available_balance).toFixed(2)} más para solicitar un retiro
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4 - LINKS */}
            <TabsContent value="links" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tu Embudo Personalizado</CardTitle>
                  <CardDescription>
                    Comparte este embudo para captar leads interesados en el club de viajes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Link del Embudo</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={funnelUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={copyFunnelLink} variant="outline">
                        {copiedFunnel ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a href={funnelUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver mi Embudo
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Link de Referidos del Funnel</CardTitle>
                  <CardDescription>
                    Comparte este link con otros miembros de tu equipo que quieran su propio embudo (ganas $39.50 por cada uno)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Link de Referidos</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={referralUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={copyReferralLink} variant="outline">
                        {copiedReferral ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mensaje Sugerido</CardTitle>
                  <CardDescription>
                    Usa este mensaje para compartir tu embudo por WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <p className="italic">
                      "¡Hola! 🌍✈️ ¿Te gustaría viajar más pagando menos? Te comparto info sobre el club de viajes con mejores tarifas que encontré. Echa un vistazo: {funnelUrl}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5 - PROFILE */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Tus datos de perfil y configuración
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Nombre Completo</Label>
                      <Input value={profile?.full_name || ""} readOnly className="mt-2" />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input value={profile?.username || ""} readOnly className="mt-2" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={profile?.email || ""} readOnly className="mt-2" />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={profile?.whatsapp_number || ""} readOnly className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billetera USDT (BSC)</CardTitle>
                  <CardDescription>
                    Configura tu billetera para recibir pagos de comisiones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Dirección de Billetera</Label>
                    <Input
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="0x..."
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Solo billeteras USDT en la red Binance Smart Chain (BSC)
                    </p>
                  </div>
                  <Button
                    onClick={saveWalletAddress}
                    disabled={savingWallet}
                    className="w-full"
                  >
                    {savingWallet ? "Guardando..." : "Guardar Billetera"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}