import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

export function PersonasTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    demographics: "",
    psychographics: "",
    painPoints: "",
    goals: "",
    preferredChannels: "",
  });

  const { data: personas = [], isLoading, refetch } = trpc.personas.list.useQuery();
  const createMutation = trpc.personas.create.useMutation();
  const updateMutation = trpc.personas.update.useMutation();
  const deleteMutation = trpc.personas.delete.useMutation();

  const handleOpenDialog = (persona?: any) => {
    if (persona) {
      setEditingPersona(persona);
      setFormData({
        name: persona.name || "",
        description: persona.description || "",
        demographics: persona.demographics || "",
        psychographics: persona.psychographics || "",
        painPoints: persona.painPoints || "",
        goals: persona.goals || "",
        preferredChannels: persona.preferredChannels || "",
      });
    } else {
      setEditingPersona(null);
      setFormData({
        name: "",
        description: "",
        demographics: "",
        psychographics: "",
        painPoints: "",
        goals: "",
        preferredChannels: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPersona) {
        await updateMutation.mutateAsync({
          id: editingPersona.id,
          ...formData,
        });
        toast.success("Persona updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Persona created successfully");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save persona");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this persona?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Persona deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete persona");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading personas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Target Personas</h2>
          <p className="text-muted-foreground">Define your target audiences and their characteristics</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Persona
        </Button>
      </div>

      {personas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No personas defined yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Persona
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    {persona.description && (
                      <CardDescription className="mt-2">{persona.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(persona)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(persona.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {persona.demographics && (
                  <div>
                    <p className="text-sm font-medium">Demographics</p>
                    <p className="text-sm text-muted-foreground">{persona.demographics}</p>
                  </div>
                )}
                {persona.painPoints && (
                  <div>
                    <p className="text-sm font-medium">Pain Points</p>
                    <p className="text-sm text-muted-foreground">{persona.painPoints}</p>
                  </div>
                )}
                {persona.preferredChannels && (
                  <div>
                    <p className="text-sm font-medium">Preferred Channels</p>
                    <p className="text-sm text-muted-foreground">{persona.preferredChannels}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPersona ? "Edit Persona" : "Create Persona"}</DialogTitle>
            <DialogDescription>
              Define a target audience for your brand
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Referring Physician, Patient, Family Member"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief overview of this persona"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="demographics">Demographics</Label>
              <Textarea
                id="demographics"
                value={formData.demographics}
                onChange={(e) => setFormData({ ...formData, demographics: e.target.value })}
                placeholder="Age, location, income, education level, etc."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="psychographics">Psychographics</Label>
              <Textarea
                id="psychographics"
                value={formData.psychographics}
                onChange={(e) => setFormData({ ...formData, psychographics: e.target.value })}
                placeholder="Values, interests, lifestyle, personality traits"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="painPoints">Pain Points</Label>
              <Textarea
                id="painPoints"
                value={formData.painPoints}
                onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                placeholder="Problems, challenges, frustrations they face"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="What they want to achieve"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="preferredChannels">Preferred Channels</Label>
              <Input
                id="preferredChannels"
                value={formData.preferredChannels}
                onChange={(e) => setFormData({ ...formData, preferredChannels: e.target.value })}
                placeholder="e.g., LinkedIn, Facebook, Email"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingPersona ? "Update" : "Create"} Persona
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
