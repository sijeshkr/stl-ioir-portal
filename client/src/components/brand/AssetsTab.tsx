import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Type, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";

export function AssetsTab() {
  const [formData, setFormData] = useState({
    primaryLogoUrl: "",
    secondaryLogoUrl: "",
    iconUrl: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    backgroundColor: "",
    textColor: "",
    primaryFont: "",
    secondaryFont: "",
    headingFontSize: "",
    bodyFontSize: "",
    fontWeights: "",
  });

  const { data: assets, isLoading, refetch } = trpc.brandAssets.get.useQuery();
  const upsertMutation = trpc.brandAssets.upsert.useMutation();

  // Load existing assets into form
  useEffect(() => {
    if (assets) {
      setFormData({
        primaryLogoUrl: assets.primaryLogoUrl || "",
        secondaryLogoUrl: assets.secondaryLogoUrl || "",
        iconUrl: assets.iconUrl || "",
        primaryColor: assets.primaryColor || "",
        secondaryColor: assets.secondaryColor || "",
        accentColor: assets.accentColor || "",
        backgroundColor: assets.backgroundColor || "",
        textColor: assets.textColor || "",
        primaryFont: assets.primaryFont || "",
        secondaryFont: assets.secondaryFont || "",
        headingFontSize: assets.headingFontSize || "",
        bodyFontSize: assets.bodyFontSize || "",
        fontWeights: assets.fontWeights || "",
      });
    }
  }, [assets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await upsertMutation.mutateAsync(formData);
      toast.success("Brand assets saved successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save brand assets");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading brand assets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Assets</h2>
          <p className="text-muted-foreground">Manage logos, colors, and typography</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Logo Files
            </CardTitle>
            <CardDescription>Upload and manage your brand logos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryLogoUrl">Primary Logo URL</Label>
              <Input
                id="primaryLogoUrl"
                value={formData.primaryLogoUrl}
                onChange={(e) => setFormData({ ...formData, primaryLogoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              {formData.primaryLogoUrl && (
                <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                  <img 
                    src={formData.primaryLogoUrl} 
                    alt="Primary Logo" 
                    className="max-h-20 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="secondaryLogoUrl">Secondary Logo URL (Optional)</Label>
              <Input
                id="secondaryLogoUrl"
                value={formData.secondaryLogoUrl}
                onChange={(e) => setFormData({ ...formData, secondaryLogoUrl: e.target.value })}
                placeholder="https://example.com/logo-alt.png"
              />
              {formData.secondaryLogoUrl && (
                <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                  <img 
                    src={formData.secondaryLogoUrl} 
                    alt="Secondary Logo" 
                    className="max-h-20 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="iconUrl">Icon/Favicon URL (Optional)</Label>
              <Input
                id="iconUrl"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                placeholder="https://example.com/icon.png"
              />
              {formData.iconUrl && (
                <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                  <img 
                    src={formData.iconUrl} 
                    alt="Icon" 
                    className="max-h-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              💡 Tip: Upload logos to the Files page first, then paste the URL here
            </p>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Palette
            </CardTitle>
            <CardDescription>Define your brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor || "#0073E6"}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#0073E6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor || "#F77F00"}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#F77F00"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={formData.accentColor || "#10B981"}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor || "#FFFFFF"}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={formData.textColor || "#000000"}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typography
            </CardTitle>
            <CardDescription>Define fonts and text sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryFont">Primary Font</Label>
                <Input
                  id="primaryFont"
                  value={formData.primaryFont}
                  onChange={(e) => setFormData({ ...formData, primaryFont: e.target.value })}
                  placeholder="e.g., Outfit, Inter, Roboto"
                />
              </div>

              <div>
                <Label htmlFor="secondaryFont">Secondary Font (Optional)</Label>
                <Input
                  id="secondaryFont"
                  value={formData.secondaryFont}
                  onChange={(e) => setFormData({ ...formData, secondaryFont: e.target.value })}
                  placeholder="e.g., Georgia, Merriweather"
                />
              </div>

              <div>
                <Label htmlFor="headingFontSize">Heading Font Size</Label>
                <Input
                  id="headingFontSize"
                  value={formData.headingFontSize}
                  onChange={(e) => setFormData({ ...formData, headingFontSize: e.target.value })}
                  placeholder="e.g., 32px, 2rem"
                />
              </div>

              <div>
                <Label htmlFor="bodyFontSize">Body Font Size</Label>
                <Input
                  id="bodyFontSize"
                  value={formData.bodyFontSize}
                  onChange={(e) => setFormData({ ...formData, bodyFontSize: e.target.value })}
                  placeholder="e.g., 16px, 1rem"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fontWeights">Font Weights (JSON)</Label>
              <Input
                id="fontWeights"
                value={formData.fontWeights}
                onChange={(e) => setFormData({ ...formData, fontWeights: e.target.value })}
                placeholder='{"light": 300, "regular": 400, "bold": 700}'
              />
              <p className="text-xs text-muted-foreground mt-1">
                Define font weights as JSON object
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={upsertMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            Save Brand Assets
          </Button>
        </div>
      </form>
    </div>
  );
}
