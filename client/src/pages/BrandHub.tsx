import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users, Briefcase, Heart, FileText, LayoutDashboard } from "lucide-react";
import { PersonasTab } from "@/components/brand/PersonasTab";
import { ServicesTab } from "@/components/brand/ServicesTab";
import { ConditionsTab } from "@/components/brand/ConditionsTab";
import { GuidelinesTab } from "@/components/brand/GuidelinesTab";
import { AssetsTab } from "@/components/brand/AssetsTab";
import { trpc } from "@/lib/trpc";

export default function BrandHub() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch counts for dashboard
  const { data: personas } = trpc.personas.list.useQuery();
  const { data: services } = trpc.services.list.useQuery();
  const { data: conditions } = trpc.conditions.list.useQuery();
  const { data: guidelines } = trpc.brandGuidelines.get.useQuery();
  const { data: assets } = trpc.brandAssets.get.useQuery();

  return (
    <DashboardLayout>
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brand Hub</h1>
        <p className="text-muted-foreground">
          Manage your brand identity, personas, services, and assets in one place
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="guidelines" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Guidelines</span>
          </TabsTrigger>
          <TabsTrigger value="personas" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Personas</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Conditions</span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Assets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Personas</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personas?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Target audiences defined</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Services</CardTitle>
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Service offerings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Conditions</CardTitle>
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conditions?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Conditions treated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Brand Status</CardTitle>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {guidelines && assets ? "Complete" : "In Progress"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Guidelines & assets</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your brand elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("personas")}
                    className="p-4 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <Users className="h-5 w-5 text-blue-600 mb-2" />
                    <h3 className="font-semibold">Manage Personas</h3>
                    <p className="text-sm text-muted-foreground">Define target audiences</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("services")}
                    className="p-4 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <Briefcase className="h-5 w-5 text-green-600 mb-2" />
                    <h3 className="font-semibold">Manage Services</h3>
                    <p className="text-sm text-muted-foreground">Add service offerings</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("conditions")}
                    className="p-4 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <Heart className="h-5 w-5 text-pink-600 mb-2" />
                    <h3 className="font-semibold">Manage Conditions</h3>
                    <p className="text-sm text-muted-foreground">Define conditions treated</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("guidelines")}
                    className="p-4 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <FileText className="h-5 w-5 text-purple-600 mb-2" />
                    <h3 className="font-semibold">Brand Guidelines</h3>
                    <p className="text-sm text-muted-foreground">Set voice & tone</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guidelines">
          <GuidelinesTab />
        </TabsContent>

        <TabsContent value="personas">
          <PersonasTab />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="conditions">
          <ConditionsTab />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsTab />
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}
