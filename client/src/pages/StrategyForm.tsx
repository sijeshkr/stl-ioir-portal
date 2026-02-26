import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Send, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

interface FunnelTier {
  name: string;
  description: string;
  channels: string[];
}

interface PlatformAllocation {
  [key: string]: number;
}

interface BudgetAllocation {
  [key: string]: number;
}

interface TimelinePhase {
  name: string;
  startDate: string;
  endDate: string;
  goals: string;
}

interface Persona {
  name: string;
  description: string;
  demographics: string;
  painPoints: string;
  goals: string;
}

interface Service {
  name: string;
  description: string;
}

interface Condition {
  name: string;
  description: string;
}

export default function StrategyForm() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const strategyId = params.id ? parseInt(params.id) : null;
  const isEdit = strategyId !== null;

  // Form state
  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0");
  const [isDefault, setIsDefault] = useState(false);
  const [notes, setNotes] = useState("");

  // Funnel configuration
  const [funnelTiers, setFunnelTiers] = useState<FunnelTier[]>([
    { name: "Tier 1: Authority", description: "Establish as physician's choice", channels: ["LinkedIn", "Physician Networks", "Tumor Boards"] },
    { name: "Tier 2: Education", description: "Answer what is IO/IR", channels: ["Facebook", "Website", "YouTube"] },
    { name: "Tier 3: Action", description: "Make it easy to refer or book", channels: ["Google Search", "Referral Portal", "Direct Outreach"] },
  ]);

  // Platform allocation
  const [platforms, setPlatforms] = useState<PlatformAllocation>({
    linkedin: 60,
    facebook: 30,
    instagram: 10,
  });

  // Budget allocation
  const [budgets, setBudgets] = useState<BudgetAllocation>({
    linkedin: 800,
    facebook: 600,
    google: 200,
  });

  // Timeline
  const [timeline, setTimeline] = useState<TimelinePhase[]>([
    { name: "Pre-Launch", startDate: "2026-02-18", endDate: "2026-03-07", goals: "Build awareness & anticipation" },
    { name: "Launch Week", startDate: "2026-03-10", endDate: "2026-03-14", goals: "Maximize visibility & momentum" },
    { name: "Post-Launch", startDate: "2026-03-15", endDate: "2026-05-31", goals: "Sustain engagement & build pipeline" },
  ]);

  // Personas, Services, Conditions
  const [personas, setPersonas] = useState<Persona[]>([
    { name: "Referring Physician", description: "Medical oncologists, surgeons", demographics: "40-65 years old, St. Louis area", painPoints: "Need fast turnaround for patients", goals: "Reliable referral partner" },
  ]);
  const [services, setServices] = useState<Service[]>([
    { name: "Y90 Radioembolization", description: "Liver cancer treatment" },
    { name: "TACE", description: "Transarterial chemoembolization" },
  ]);
  const [conditions, setConditions] = useState<Condition[]>([
    { name: "Liver Cancer", description: "Primary and metastatic liver tumors" },
    { name: "Kidney Cancer", description: "Renal cell carcinoma" },
  ]);

  const clientId = 1; // TODO: Get from context

  // Load strategy if editing
  const { data: strategy, isLoading } = trpc.strategies.get.useQuery(
    { id: strategyId! },
    { enabled: isEdit }
  );

  useEffect(() => {
    if (strategy) {
      setName(strategy.name);
      setVersion(strategy.version);
      setIsDefault(strategy.isDefault === 1);
      setNotes(strategy.notes || "");

      if (strategy.funnelConfig) {
        const config = JSON.parse(strategy.funnelConfig);
        if (config.tiers) setFunnelTiers(config.tiers);
      }
      if (strategy.platformAllocation) {
        setPlatforms(JSON.parse(strategy.platformAllocation));
      }
      if (strategy.budgetAllocation) {
        setBudgets(JSON.parse(strategy.budgetAllocation));
      }
      if (strategy.timeline) {
        const timelineData = JSON.parse(strategy.timeline);
        if (timelineData.phases) setTimeline(timelineData.phases);
      }
      if (strategy.personas) {
        setPersonas(strategy.personas.map(p => ({
          name: p.name,
          description: p.description || "",
          demographics: p.demographics || "",
          painPoints: p.painPoints || "",
          goals: p.goals || "",
        })));
      }
      if (strategy.services) {
        setServices(strategy.services.map(s => ({
          name: s.name,
          description: s.description || "",
        })));
      }
      if (strategy.conditions) {
        setConditions(strategy.conditions.map(c => ({
          name: c.name,
          description: c.description || "",
        })));
      }
    }
  }, [strategy]);

  const createMutation = trpc.strategies.create.useMutation({
    onSuccess: () => {
      toast.success("Strategy created successfully");
      setLocation("/strategies");
    },
    onError: (error) => {
      toast.error(`Failed to create strategy: ${error.message}`);
    },
  });

  const updateMutation = trpc.strategies.update.useMutation({
    onSuccess: () => {
      toast.success("Strategy updated successfully");
      setLocation("/strategies");
    },
    onError: (error) => {
      toast.error(`Failed to update strategy: ${error.message}`);
    },
  });

  const handleSave = (status: "draft" | "pending_approval") => {
    const data = {
      clientId,
      name,
      version,
      isDefault,
      funnelConfig: JSON.stringify({ tiers: funnelTiers }),
      platformAllocation: JSON.stringify(platforms),
      budgetAllocation: JSON.stringify(budgets),
      timeline: JSON.stringify({ phases: timeline }),
      notes,
      personas,
      services,
      conditions,
    };

    if (isEdit) {
      updateMutation.mutate({
        id: strategyId!,
        ...data,
        status,
      });
    } else {
      createMutation.mutate(data);
    }
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/strategies")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{isEdit ? "Edit Strategy" : "New Strategy"}</h1>
          <p className="text-muted-foreground mt-1">
            Configure your marketing strategy framework
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="offerings">Offerings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General strategy details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Strategy Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Launch Strategy, Post-Launch Strategy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <Label htmlFor="is-default">Set as default strategy</Label>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notes">High-Level Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add strategic notes, objectives, or context..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Funnel Configuration</CardTitle>
              <CardDescription>Define your 3-tier marketing funnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {funnelTiers.map((tier, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Tier {index + 1}</h4>
                    {funnelTiers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFunnelTiers(funnelTiers.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tier Name</Label>
                      <Input
                        value={tier.name}
                        onChange={(e) => {
                          const newTiers = [...funnelTiers];
                          newTiers[index].name = e.target.value;
                          setFunnelTiers(newTiers);
                        }}
                        placeholder="e.g., Tier 1: Authority"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={tier.description}
                        onChange={(e) => {
                          const newTiers = [...funnelTiers];
                          newTiers[index].description = e.target.value;
                          setFunnelTiers(newTiers);
                        }}
                        placeholder="e.g., Establish as physician's choice"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Channels (comma-separated)</Label>
                    <Input
                      value={tier.channels.join(", ")}
                      onChange={(e) => {
                        const newTiers = [...funnelTiers];
                        newTiers[index].channels = e.target.value.split(",").map(c => c.trim());
                        setFunnelTiers(newTiers);
                      }}
                      placeholder="e.g., LinkedIn, Physician Networks, Tumor Boards"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setFunnelTiers([...funnelTiers, { name: "", description: "", channels: [] }])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tier
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Allocation</CardTitle>
                <CardDescription>Percentage of effort per platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(platforms).map(([platform, percentage]) => (
                  <div key={platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{platform}</Label>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={percentage}
                      onChange={(e) => setPlatforms({ ...platforms, [platform]: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPlatform = prompt("Enter platform name:");
                    if (newPlatform) {
                      setPlatforms({ ...platforms, [newPlatform.toLowerCase()]: 0 });
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Platform
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Budget per platform (USD)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(budgets).map(([platform, budget]) => (
                  <div key={platform} className="space-y-2">
                    <Label className="capitalize">{platform}</Label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudgets({ ...budgets, [platform]: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPlatform = prompt("Enter platform name:");
                    if (newPlatform) {
                      setBudgets({ ...budgets, [newPlatform.toLowerCase()]: 0 });
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Platform
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
              <CardDescription>Define campaign phases with dates and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {timeline.map((phase, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Phase {index + 1}</h4>
                    {timeline.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTimeline(timeline.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Phase Name</Label>
                      <Input
                        value={phase.name}
                        onChange={(e) => {
                          const newTimeline = [...timeline];
                          newTimeline[index].name = e.target.value;
                          setTimeline(newTimeline);
                        }}
                        placeholder="e.g., Pre-Launch"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={phase.startDate}
                        onChange={(e) => {
                          const newTimeline = [...timeline];
                          newTimeline[index].startDate = e.target.value;
                          setTimeline(newTimeline);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={phase.endDate}
                        onChange={(e) => {
                          const newTimeline = [...timeline];
                          newTimeline[index].endDate = e.target.value;
                          setTimeline(newTimeline);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Goals</Label>
                    <Textarea
                      value={phase.goals}
                      onChange={(e) => {
                        const newTimeline = [...timeline];
                        newTimeline[index].goals = e.target.value;
                        setTimeline(newTimeline);
                      }}
                      placeholder="e.g., Build awareness & anticipation"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setTimeline([...timeline, { name: "", startDate: "", endDate: "", goals: "" }])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Phase
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Personas</CardTitle>
              <CardDescription>Define your target audiences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {personas.map((persona, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Persona {index + 1}</h4>
                    {personas.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPersonas(personas.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Persona Name</Label>
                      <Input
                        value={persona.name}
                        onChange={(e) => {
                          const newPersonas = [...personas];
                          newPersonas[index].name = e.target.value;
                          setPersonas(newPersonas);
                        }}
                        placeholder="e.g., Referring Physician"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={persona.description}
                        onChange={(e) => {
                          const newPersonas = [...personas];
                          newPersonas[index].description = e.target.value;
                          setPersonas(newPersonas);
                        }}
                        placeholder="e.g., Medical oncologists, surgeons"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Demographics</Label>
                    <Textarea
                      value={persona.demographics}
                      onChange={(e) => {
                        const newPersonas = [...personas];
                        newPersonas[index].demographics = e.target.value;
                        setPersonas(newPersonas);
                      }}
                      placeholder="e.g., 40-65 years old, St. Louis area"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pain Points</Label>
                      <Textarea
                        value={persona.painPoints}
                        onChange={(e) => {
                          const newPersonas = [...personas];
                          newPersonas[index].painPoints = e.target.value;
                          setPersonas(newPersonas);
                        }}
                        placeholder="e.g., Need fast turnaround for patients"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Goals</Label>
                      <Textarea
                        value={persona.goals}
                        onChange={(e) => {
                          const newPersonas = [...personas];
                          newPersonas[index].goals = e.target.value;
                          setPersonas(newPersonas);
                        }}
                        placeholder="e.g., Reliable referral partner"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setPersonas([...personas, { name: "", description: "", demographics: "", painPoints: "", goals: "" }])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Persona
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offerings Tab */}
        <TabsContent value="offerings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Services you offer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Service {index + 1}</h4>
                      {services.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setServices(services.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={service.name}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[index].name = e.target.value;
                          setServices(newServices);
                        }}
                        placeholder="e.g., Y90 Radioembolization"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[index].description = e.target.value;
                          setServices(newServices);
                        }}
                        placeholder="e.g., Liver cancer treatment"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setServices([...services, { name: "", description: "" }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conditions</CardTitle>
                <CardDescription>Conditions you treat/address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conditions.map((condition, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Condition {index + 1}</h4>
                      {conditions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setConditions(conditions.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={condition.name}
                        onChange={(e) => {
                          const newConditions = [...conditions];
                          newConditions[index].name = e.target.value;
                          setConditions(newConditions);
                        }}
                        placeholder="e.g., Liver Cancer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={condition.description}
                        onChange={(e) => {
                          const newConditions = [...conditions];
                          newConditions[index].description = e.target.value;
                          setConditions(newConditions);
                        }}
                        placeholder="e.g., Primary and metastatic liver tumors"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setConditions([...conditions, { name: "", description: "" }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}
