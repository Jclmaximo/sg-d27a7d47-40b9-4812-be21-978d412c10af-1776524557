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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SEO } from "@/components/SEO";
import { ArrowLeft, DollarSign, TrendingUp, Users, Copy, Check, Wallet } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function NetworkPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [tree, setTree] = useState<ReferralTreeNode | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [savedWallet, setSavedWallet] = useState("");
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [savingWallet, setSavingWallet] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    // Get username and wallet
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, usdt_wallet_address")
      .eq("id", user.id)
      .single();

    if (profile?.username) {
      setUsername(profile.username);
    }
    if (profile?.usdt_wallet_address) {
      setSavedWallet(profile.usdt_wallet_address);
      setWalletAddress(profile.usdt_wallet_address);
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

  const copyReferralLink = () => {
    if (!username) return;
    
    const referralUrl = `${window.location.origin}/pricing?ref=${username}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    
    toast({
      title: "¡Copiado!",
      description: "Link de referido copiado al portapapeles"
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const saveWalletAddress = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una dirección de billetera válida",
        variant: "destructive"
      });
      return;
    }

    setSavingWallet(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ usdt_wallet_address: walletAddress })
        .eq("id", user.id);

      if (error) throw error;

      setSavedWallet(walletAddress);
      toast({
        title: "✅ Billetera guardada",
        description: "Tu dirección USDT (BSC) ha sido actualizada"
      });
    } catch (error) {
      console.error("Error saving wallet:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la billetera",
        variant: "destructive"
      });
    } finally {
      setSavingWallet(false);
    }
  };

  const requestWithdrawal = async () => {
    if (!savedWallet) {
      toast({
        title: "Billetera requerida",
        description: "Por favor configura tu billetera USDT (BSC) primero",
        variant: "destructive"
      });
      return;
    }

    if (!stats || stats.pendingCommissions === 0) {
      toast({
        title: "Sin comisiones",
        description: "No tienes comisiones pendientes para retirar",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create withdrawal request in database
      const { error } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: user.id,
          amount_usd: stats.pendingCommissions,
          wallet_address: savedWallet,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "✅ Solicitud enviada",
        description: `Tu solicitud de retiro de ${formatCurrency(stats.pendingCommissions)} ha sido enviada. Recibirás el pago en 24-48 horas.`,
        duration: 5000
      });
      
      setShowWithdrawDialog(false);
      
      // Reload data to refresh stats
      await loadData();
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud de retiro. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const renderTree = (node: ReferralTreeNode, depth: number = 0) => {
    const indent = depth * 40;
    
    return (
      <div key={node.id} style={{ marginLeft: `${indent}px` }} className="space-y-2">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{node.full_name || node.email}</div>
              <div className="text-sm text-muted-foreground">
                {node.username && <span className="font-mono">@{node.username}</span>}
                {" • "}
                {formatDate(node.created_at)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Comisiones ganadas</div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(node.totalEarned)}
              </div>
            </div>
          </div>
        </Card>
        {node.children.map(child => renderTree(child, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando red...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Mi Red - Viaja Ligero" description="Gestiona tu red de referidos" />
      
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">Mi Red de Referidos del Funnel</h1>
            <p className="text-muted-foreground mt-2">
              Gana comisiones del 50% invitando nuevos ambassadors
            </p>
          </div>

          {/* Referral Link */}
          {username && (
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Tu Link de Referidos del Funnel</CardTitle>
                <CardDescription>
                  Comparte este link para que otros miembros de tu equipo obtengan su propio embudo (ganas $39.50 por cada uno)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/pricing?ref=${username}`}
                    className="font-mono"
                  />
                  <Button onClick={copyReferralLink} variant="secondary">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referidos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.directReferrals || 0}</div>
                <p className="text-xs text-muted-foreground">50% comisión por cada uno</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ganado</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency((stats?.pendingCommissions || 0) + (stats?.paidCommissions || 0))}
                </div>
                <p className="text-xs text-muted-foreground">Suma de todas las comisiones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponible para Retiro</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats?.pendingCommissions || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Comisiones pendientes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ya Retirado</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats?.paidCommissions || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Pagos completados</p>
              </CardContent>
            </Card>
          </div>

          {/* Wallet & Withdrawal Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Configuración de Pagos</CardTitle>
              <CardDescription>Configura tu billetera USDT (BSC) para recibir tus comisiones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet">Dirección de Billetera USDT (BSC)</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={saveWalletAddress}
                    disabled={savingWallet || walletAddress === savedWallet}
                  >
                    {savingWallet ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
                {savedWallet && (
                  <p className="text-xs text-green-600">
                    ✓ Billetera configurada: {savedWallet.substring(0, 10)}...{savedWallet.substring(savedWallet.length - 8)}
                  </p>
                )}
              </div>

              <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full"
                    disabled={!stats || stats.pendingCommissions === 0 || !savedWallet}
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Solicitar Retiro de Comisiones
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Retiro</DialogTitle>
                    <DialogDescription>
                      Confirma tu solicitud de retiro. Los pagos se procesan en 24-48 horas.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Monto a retirar:</span>
                        <span className="font-bold text-lg">{formatCurrency(stats?.pendingCommissions || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Billetera destino:</span>
                        <span className="font-mono text-xs">{savedWallet.substring(0, 10)}...{savedWallet.substring(savedWallet.length - 8)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawDialog(false)}>
                        Cancelar
                      </Button>
                      <Button className="flex-1" onClick={requestWithdrawal}>
                        Confirmar Retiro
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Commissions Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Historial de Comisiones</CardTitle>
              <CardDescription>Todas tus comisiones generadas (50% por cada referido)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Referido</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No tienes comisiones todavía. ¡Comparte tu link de referido!
                        </TableCell>
                      </TableRow>
                    ) : (
                      commissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell>{formatDate(commission.created_at)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {commission.referred_user?.full_name || commission.referred_user?.email}
                              </div>
                              {commission.referred_user?.username && (
                                <div className="text-sm text-muted-foreground">
                                  @{commission.referred_user.username}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(commission.amount_usd)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              commission.status === "paid" ? "default" :
                              commission.status === "pending" ? "secondary" : "destructive"
                            }>
                              {commission.status === "paid" ? "Pagado" :
                               commission.status === "pending" ? "Pendiente" : "Cancelado"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Referral Tree */}
          <Card>
            <CardHeader>
              <CardTitle>Árbol de Referidos</CardTitle>
              <CardDescription>Visualiza tu red de referidos</CardDescription>
            </CardHeader>
            <CardContent>
              {tree && tree.children.length > 0 ? (
                <div className="space-y-4">
                  {tree.children.map(child => renderTree(child, 0))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tienes referidos todavía</p>
                  <p className="text-sm">Comparte tu link para empezar a construir tu red</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}