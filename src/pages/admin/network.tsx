import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { referralService, type Commission, type NetworkStats, type ReferralTreeNode } from "@/services/referralService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { ArrowLeft, DollarSign, TrendingUp, Users, Copy, Check } from "lucide-react";
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    // Get username
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile?.username) {
      setUsername(profile.username);
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
                Nivel {node.level + 1}
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
            <h1 className="text-4xl font-bold">Mi Red de Referidos</h1>
            <p className="text-muted-foreground mt-2">
              Gana comisiones invitando nuevos ambassadors
            </p>
          </div>

          {/* Referral Link */}
          {username && (
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Tu Link de Referido</CardTitle>
                <CardDescription>
                  Comparte este link para ganar 30% en cada referido directo y 10% en indirectos
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
                <CardTitle className="text-sm font-medium">Referidos Directos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.directReferrals || 0}</div>
                <p className="text-xs text-muted-foreground">Nivel 1 - 30% comisión</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referidos Indirectos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.indirectReferrals || 0}</div>
                <p className="text-xs text-muted-foreground">Nivel 2 - 10% comisión</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comisiones Pendientes</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats?.pendingCommissions || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Por pagar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comisiones Pagadas</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats?.paidCommissions || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total ganado</p>
              </CardContent>
            </Card>
          </div>

          {/* Commissions Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Historial de Comisiones</CardTitle>
              <CardDescription>Todas tus comisiones generadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Referido</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
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
                          <TableCell>
                            <Badge variant={commission.commission_level === 1 ? "default" : "secondary"}>
                              Nivel {commission.commission_level}
                            </Badge>
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
              <CardDescription>Visualiza tu red de referidos multinivel</CardDescription>
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