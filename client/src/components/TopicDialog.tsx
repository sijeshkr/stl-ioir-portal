import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface TopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TopicDialog({ open, onOpenChange, onSuccess }: TopicDialogProps) {
  const [formData, setFormData] = useState({
    monthlyPlanId: "",
    scheduledDate: "",
    topicTitle: "",
    cta: "",
    audience: "",
    platform: "",
  });

  const { data: monthlyPlans } = trpc.monthlyPlans.list.useQuery();
  const createTopic = trpc.contentCalendar.create.useMutation({
    onSuccess: () => {
      toast.success("Topic created successfully");
      setFormData({
        monthlyPlanId: "",
        scheduledDate: "",
        topicTitle: "",
        cta: "",
        audience: "",
        platform: "",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create topic");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.monthlyPlanId || !formData.scheduledDate || !formData.topicTitle || !formData.platform) {
      toast.error("Please fill in all required fields");
      return;
    }

    createTopic.mutate({
      monthlyPlanId: parseInt(formData.monthlyPlanId),
      scheduledDate: formData.scheduledDate,
      topicTitle: formData.topicTitle,
      cta: formData.cta || undefined,
      audience: formData.audience || undefined,
      platform: formData.platform,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Content Topic</DialogTitle>
          <DialogDescription>
            Plan a high-level content topic before creating detailed copy
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="monthlyPlan">
                Monthly Plan <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.monthlyPlanId}
                onValueChange={(value) =>
                  setFormData({ ...formData, monthlyPlanId: value })
                }
              >
                <SelectTrigger id="monthlyPlan">
                  <SelectValue placeholder="Select monthly plan" />
                </SelectTrigger>
                <SelectContent>
                  {monthlyPlans?.map((plan: any) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheduledDate">
                Scheduled Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="platform">
                Platform <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="topicTitle">
                Topic Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="topicTitle"
                placeholder="e.g., No Knife Needed - The Pinhole Advantage"
                value={formData.topicTitle}
                onChange={(e) =>
                  setFormData({ ...formData, topicTitle: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Referring Physicians, Patients 40-70"
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cta">Call to Action</Label>
              <Textarea
                id="cta"
                placeholder="e.g., Request appointment, Visit website, Call now"
                value={formData.cta}
                onChange={(e) =>
                  setFormData({ ...formData, cta: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTopic.isPending}>
              {createTopic.isPending ? "Creating..." : "Create Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
