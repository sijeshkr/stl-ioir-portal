import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

export function ConditionsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    symptoms: "",
    treatments: "",
    relatedServices: "",
  });

  const { data: conditions = [], isLoading, refetch } = trpc.conditions.list.useQuery();
  const createMutation = trpc.conditions.create.useMutation();
  const updateMutation = trpc.conditions.update.useMutation();
  const deleteMutation = trpc.conditions.delete.useMutation();

  const handleOpenDialog = (condition?: any) => {
    if (condition) {
      setEditingCondition(condition);
      setFormData({
        name: condition.name || "",
        description: condition.description || "",
        symptoms: condition.symptoms || "",
        treatments: condition.treatments || "",
        relatedServices: condition.relatedServices || "",
      });
    } else {
      setEditingCondition(null);
      setFormData({
        name: "",
        description: "",
        symptoms: "",
        treatments: "",
        relatedServices: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCondition) {
        await updateMutation.mutateAsync({
          id: editingCondition.id,
          ...formData,
        });
        toast.success("Condition updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Condition created successfully");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save condition");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this condition?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Condition deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete condition");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading conditions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conditions Treated</h2>
          <p className="text-muted-foreground">Manage medical conditions and treatments you specialize in</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </div>

      {conditions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No conditions defined yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Condition
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conditions.map((condition) => (
            <Card key={condition.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{condition.name}</CardTitle>
                    {condition.description && (
                      <CardDescription className="mt-2">{condition.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(condition)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(condition.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {condition.symptoms && (
                  <div>
                    <p className="text-sm font-medium">Common Symptoms</p>
                    <p className="text-sm text-muted-foreground">{condition.symptoms}</p>
                  </div>
                )}
                {condition.treatments && (
                  <div>
                    <p className="text-sm font-medium">Available Treatments</p>
                    <p className="text-sm text-muted-foreground">{condition.treatments}</p>
                  </div>
                )}
                {condition.relatedServices && (
                  <div>
                    <p className="text-sm font-medium">Related Services</p>
                    <p className="text-sm text-muted-foreground">{condition.relatedServices}</p>
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
            <DialogTitle>{editingCondition ? "Edit Condition" : "Create Condition"}</DialogTitle>
            <DialogDescription>
              Define a medical condition you treat
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Condition Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Liver Cancer, Kidney Cancer, Fibroids"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief overview of this condition"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="symptoms">Common Symptoms</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="What symptoms do patients typically experience?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="treatments">Available Treatments</Label>
              <Textarea
                id="treatments"
                value={formData.treatments}
                onChange={(e) => setFormData({ ...formData, treatments: e.target.value })}
                placeholder="What treatment options are available?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="relatedServices">Related Services</Label>
              <Input
                id="relatedServices"
                value={formData.relatedServices}
                onChange={(e) => setFormData({ ...formData, relatedServices: e.target.value })}
                placeholder="e.g., Y90, TACE, Ablation"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCondition ? "Update" : "Create"} Condition
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
