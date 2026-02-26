import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreVertical, Copy, Edit, Trash, CheckCircle, Clock, FileText, Target } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

export default function Strategies() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [clientId] = useState(1); // TODO: Get from context/URL
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [cloneStrategyId, setCloneStrategyId] = useState<number | null>(null);
  const [cloneName, setCloneName] = useState("");

  const { data: strategies, isLoading, refetch } = trpc.strategies.list.useQuery({ clientId });
  const cloneMutation = trpc.strategies.clone.useMutation({
    onSuccess: () => {
      toast.success("Strategy cloned successfully");
      setCloneDialogOpen(false);
      setCloneName("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to clone strategy: ${error.message}`);
    },
  });
  const deleteMutation = trpc.strategies.delete.useMutation({
    onSuccess: () => {
      toast.success("Strategy deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete strategy: ${error.message}`);
    },
  });

  const handleClone = (id: number, name: string) => {
    setCloneStrategyId(id);
    setCloneName(`${name} (Copy)`);
    setCloneDialogOpen(true);
  };

  const handleCloneConfirm = () => {
    if (cloneStrategyId && cloneName) {
      cloneMutation.mutate({ id: cloneStrategyId, newName: cloneName });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this strategy? This action cannot be undone.")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      draft: { variant: "secondary", icon: FileText },
      pending_approval: { variant: "outline", icon: Clock },
      approved: { variant: "default", icon: CheckCircle },
      archived: { variant: "destructive", icon: Trash },
    };
    const config = variants[status] || variants.draft;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Strategies</h1>
          <p className="text-muted-foreground mt-1">
            Configure your marketing strategy frameworks, funnels, and target audiences
          </p>
        </div>
        <Button onClick={() => setLocation("/strategies/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Strategy
        </Button>
      </div>

      {strategies && strategies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No strategies yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first marketing strategy to define your funnel, platform allocation, and target audiences.
            </p>
            <Button onClick={() => setLocation("/strategies/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies?.map((strategy) => (
            <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {strategy.name}
                      {strategy.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Version {strategy.version}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLocation(`/strategies/${strategy.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClone(strategy.id, strategy.name)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(strategy.id)}
                        className="text-destructive"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(strategy.status)}
                </div>

                {strategy.platformAllocation && (
                  <div>
                    <span className="text-sm font-medium">Platform Allocation</span>
                    <div className="mt-2 space-y-1">
                      {Object.entries(JSON.parse(strategy.platformAllocation)).map(([platform, percentage]) => (
                        <div key={platform} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{platform}</span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created {new Date(strategy.createdAt).toLocaleDateString()}</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation(`/strategies/${strategy.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clone Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Strategy</DialogTitle>
            <DialogDescription>
              Create a copy of this strategy with a new name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clone-name">Strategy Name</Label>
              <Input
                id="clone-name"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="Enter strategy name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloneConfirm} disabled={!cloneName || cloneMutation.isPending}>
              {cloneMutation.isPending ? "Cloning..." : "Clone Strategy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
}
