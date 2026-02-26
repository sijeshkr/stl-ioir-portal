import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Trash, CheckCircle, Clock, Calendar as CalendarIcon, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { format } from "date-fns";

export default function MonthlyPlans() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const clientId = 1; // TODO: Get from context

  const { data: plans, isLoading } = trpc.monthlyPlans.list.useQuery({ clientId });

  const deleteMutation = trpc.monthlyPlans.delete.useMutation({
    onSuccess: () => {
      toast.success("Monthly plan deleted");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const approveMutation = trpc.monthlyPlans.approve.useMutation({
    onSuccess: () => {
      toast.success("Monthly plan approved");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to approve: ${error.message}`);
    },
  });

  const lockMutation = trpc.monthlyPlans.lock.useMutation({
    onSuccess: () => {
      toast.success("Monthly plan locked");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to lock: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this monthly plan?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      draft: { variant: "secondary", icon: Clock },
      pending_approval: { variant: "outline", icon: Clock },
      approved: { variant: "default", icon: CheckCircle },
      locked: { variant: "destructive", icon: Lock },
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Monthly Plans</h1>
            <p className="text-muted-foreground mt-1">
              Leadership meeting outputs with approved content scope
            </p>
          </div>
          <Button onClick={() => setLocation("/monthly-plans/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Monthly Plan
          </Button>
        </div>

        {plans && plans.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No monthly plans yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Create your first monthly plan to define content scope and strategy for the month.
              </p>
              <Button onClick={() => setLocation("/monthly-plans/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Monthly Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {plan.month}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLocation(`/monthly-plans/${plan.id}`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {plan.status === "pending_approval" && (
                          <DropdownMenuItem onClick={() => approveMutation.mutate({ id: plan.id })}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {plan.status === "approved" && (
                          <DropdownMenuItem onClick={() => lockMutation.mutate({ id: plan.id })}>
                            <Lock className="w-4 h-4 mr-2" />
                            Lock
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan.id)}
                          className="text-destructive"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(plan.status)}
                    </div>

                    {plan.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{plan.notes}</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setLocation(`/monthly-plans/${plan.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
