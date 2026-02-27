import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";

export function GuidelinesTab() {
  const [formData, setFormData] = useState({
    tagline: "",
    positioningStatement: "",
    brandVoice: "",
    toneGuidelines: "",
    keyMessages: "",
    messagingPillars: "",
    valueProposition: "",
    languageDos: "",
    languageDonts: "",
  });

  const { data: guidelines, isLoading, refetch } = trpc.brandGuidelines.get.useQuery();
  const upsertMutation = trpc.brandGuidelines.upsert.useMutation();

  // Load existing guidelines into form
  useEffect(() => {
    if (guidelines) {
      setFormData({
        tagline: guidelines.tagline || "",
        positioningStatement: guidelines.positioningStatement || "",
        brandVoice: guidelines.brandVoice || "",
        toneGuidelines: guidelines.toneGuidelines || "",
        keyMessages: guidelines.keyMessages || "",
        messagingPillars: guidelines.messagingPillars || "",
        valueProposition: guidelines.valueProposition || "",
        languageDos: guidelines.languageDos || "",
        languageDonts: guidelines.languageDonts || "",
      });
    }
  }, [guidelines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await upsertMutation.mutateAsync(formData);
      toast.success("Brand guidelines saved successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save brand guidelines");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading brand guidelines...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Guidelines</h2>
          <p className="text-muted-foreground">Define your brand voice, tone, messaging, and positioning</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Brand Identity
            </CardTitle>
            <CardDescription>Core brand positioning and tagline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g., Elite Expertise • Pinhole Precision • Rapid Recovery"
              />
            </div>

            <div>
              <Label htmlFor="positioningStatement">Positioning Statement</Label>
              <Textarea
                id="positioningStatement"
                value={formData.positioningStatement}
                onChange={(e) => setFormData({ ...formData, positioningStatement: e.target.value })}
                placeholder="What makes your brand unique? Who do you serve and why should they choose you?"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="valueProposition">Value Proposition</Label>
              <Textarea
                id="valueProposition"
                value={formData.valueProposition}
                onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })}
                placeholder="The unique value you deliver to customers"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Voice & Tone */}
        <Card>
          <CardHeader>
            <CardTitle>Voice & Tone</CardTitle>
            <CardDescription>How your brand communicates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <Input
                id="brandVoice"
                value={formData.brandVoice}
                onChange={(e) => setFormData({ ...formData, brandVoice: e.target.value })}
                placeholder="e.g., Professional, Compassionate, Expert, Trustworthy"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated adjectives that describe your brand personality
              </p>
            </div>

            <div>
              <Label htmlFor="toneGuidelines">Tone Guidelines</Label>
              <Textarea
                id="toneGuidelines"
                value={formData.toneGuidelines}
                onChange={(e) => setFormData({ ...formData, toneGuidelines: e.target.value })}
                placeholder="How should tone vary in different contexts? (e.g., social media vs. medical content)"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Messaging */}
        <Card>
          <CardHeader>
            <CardTitle>Key Messaging</CardTitle>
            <CardDescription>Core messages and pillars</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyMessages">Key Messages</Label>
              <Textarea
                id="keyMessages"
                value={formData.keyMessages}
                onChange={(e) => setFormData({ ...formData, keyMessages: e.target.value })}
                placeholder="List your core brand messages (one per line)"
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="messagingPillars">Messaging Pillars</Label>
              <Textarea
                id="messagingPillars"
                value={formData.messagingPillars}
                onChange={(e) => setFormData({ ...formData, messagingPillars: e.target.value })}
                placeholder="Main themes or pillars that support your messaging (one per line)"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Do's and Don'ts */}
        <Card>
          <CardHeader>
            <CardTitle>Language Guidelines</CardTitle>
            <CardDescription>What to use and what to avoid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="languageDos">Do's - Language to Use</Label>
              <Textarea
                id="languageDos"
                value={formData.languageDos}
                onChange={(e) => setFormData({ ...formData, languageDos: e.target.value })}
                placeholder="Preferred words, phrases, and terminology (one per line)"
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="languageDonts">Don'ts - Language to Avoid</Label>
              <Textarea
                id="languageDonts"
                value={formData.languageDonts}
                onChange={(e) => setFormData({ ...formData, languageDonts: e.target.value })}
                placeholder="Words, phrases, or tones to avoid (one per line)"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={upsertMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            Save Brand Guidelines
          </Button>
        </div>
      </form>
    </div>
  );
}
