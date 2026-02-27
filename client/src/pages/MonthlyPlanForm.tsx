import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Send, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

interface StrategyAllocation {
  strategyId: number;
  allocation: number;
}

interface ScopeItem {
  platform: string;
  contentType: string;
  quantity: number;
  budget?: number;
}

export default function MonthlyPlanForm() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const planId = params.id ? parseInt(params.id) : null;
  const isEdit = planId !== null;

  const clientId = 1; // TODO: Get from context

  // Form state
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [notes, setNotes] = useState("");

  // Strategy allocation
  const [strategies, setStrategies] = useState<StrategyAllocation[]>([
    { strategyId: 1, allocation: 100 },
  ]);

  // Content scope
  const [scope, setScope] = useState<ScopeItem[]>([
    { platform: "linkedin", contentType: "post", quantity: 12, budget: 0 },
    { platform: "facebook", contentType: "post", quantity: 16, budget: 0 },
    { platform: "instagram", contentType: "post", quantity: 12, budget: 0 },
  ]);

  // Load available strategies
  const { data: availableStrategies } = trpc.strategies.list.useQuery({ clientId });

  // Load plan if editing
  const { data: plan, isLoading } = trpc.monthlyPlans.get.useQuery(
    { id: planId! },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setMonth(plan.month);
      // startDate and endDate removed - using month field only
      setNotes(plan.notes || "");

      if (plan.strategies && plan.strategies.length > 0) {
        setStrategies(
          plan.strategies.map((s: any) => ({
            strategyId: s.strategyId,
            allocation: s.allocation,
          }))
        );
      }

      if (plan.scope && plan.scope.length > 0) {
        setScope(
          plan.scope.map((s: any) => ({
            platform: s.platform,
            contentType: s.contentType,
            quantity: s.quantity,
            budget: s.budget || 0,
          }))
        );
      }
    }
  }, [plan]);

  const createMutation = trpc.monthlyPlans.create.useMutation({
    onSuccess: () => {
      toast.success("Monthly plan created successfully");
      setLocation("/monthly-plans");
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });

  const updateMutation = trpc.monthlyPlans.update.useMutation({
    onSuccess: () => {
      toast.success("Monthly plan updated successfully");
      setLocation("/monthly-plans");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const handleSave = (status: "draft" | "pending_approval") => {
    if (!name || !month) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = {
      clientId,
      name,
      month,
      notes,
      strategies,
      scope,
    };

    if (isEdit) {
      updateMutation.mutate({
        id: planId!,
        ...data,
        status,
      });
    } else {
      createMutation.mutate(data);
    }
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/monthly-plans")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{isEdit ? "Edit Monthly Plan" : "New Monthly Plan"}</h1>
            <p className="text-muted-foreground mt-1">
              Define content scope and strategy for the month
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave("draft")}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave("pending_approval")}>
              <Send className="w-4 h-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="scope">Content Scope</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General plan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., March 2026 Launch"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month *</Label>
                    <Input
                      id="month"
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="notes">High-Level Notes & Themes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes from leadership meeting: themes, objectives, special campaigns..."
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Allocation</CardTitle>
                <CardDescription>
                  Select which strategies to use and allocate percentage of content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {strategies.map((strategy, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Strategy {index + 1}</h4>
                      {strategies.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setStrategies(strategies.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Strategy</Label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={strategy.strategyId}
                          onChange={(e) => {
                            const newStrategies = [...strategies];
                            newStrategies[index].strategyId = parseInt(e.target.value);
                            setStrategies(newStrategies);
                          }}
                        >
                          {availableStrategies?.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (v{s.version})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Allocation</Label>
                          <span className="text-sm text-muted-foreground">{strategy.allocation}%</span>
                        </div>
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={strategy.allocation}
                          onChange={(e) => {
                            const newStrategies = [...strategies];
                            newStrategies[index].allocation = parseInt(e.target.value);
                            setStrategies(newStrategies);
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setStrategies([...strategies, { strategyId: availableStrategies?.[0]?.id || 1, allocation: 0 }])
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Strategy
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Scope Tab */}
          <TabsContent value="scope" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Scope</CardTitle>
                <CardDescription>
                  Approved quantities per platform (agreed in leadership meeting)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {scope.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold capitalize">{item.platform} - {item.contentType}</h4>
                      {scope.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setScope(scope.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={item.platform}
                          onChange={(e) => {
                            const newScope = [...scope];
                            newScope[index].platform = e.target.value;
                            setScope(newScope);
                          }}
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="tiktok">TikTok</option>
                          <option value="youtube">YouTube</option>
                          <option value="blog">Blog</option>
                          <option value="newsletter">Newsletter</option>
                          <option value="gmb">Google My Business</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Content Type</Label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={item.contentType}
                          onChange={(e) => {
                            const newScope = [...scope];
                            newScope[index].contentType = e.target.value;
                            setScope(newScope);
                          }}
                        >
                          <option value="post">Post</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="email">Email</option>
                          <option value="ad">Ad Campaign</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newScope = [...scope];
                            newScope[index].quantity = parseInt(e.target.value) || 0;
                            setScope(newScope);
                          }}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Budget (USD)</Label>
                        <Input
                          type="number"
                          value={item.budget || 0}
                          onChange={(e) => {
                            const newScope = [...scope];
                            newScope[index].budget = parseInt(e.target.value) || 0;
                            setScope(newScope);
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setScope([...scope, { platform: "linkedin", contentType: "post", quantity: 0, budget: 0 }])
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Scope Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
