import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users, Briefcase, Heart, FileText } from "lucide-react";
import { PersonasTab } from "@/components/brand/PersonasTab";
import { ServicesTab } from "@/components/brand/ServicesTab";
import { ConditionsTab } from "@/components/brand/ConditionsTab";

export default function BrandHub() {
  const [activeTab, setActiveTab] = useState("guidelines");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Brand Hub</h1>
        <p className="text-muted-foreground">
          Manage your brand identity, personas, services, and assets in one place
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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

        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <CardDescription>
                Define your brand voice, tone, messaging, and positioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Brand guidelines content coming soon...</p>
            </CardContent>
          </Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>
                Manage logos, colors, fonts, and other brand materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Brand assets management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
