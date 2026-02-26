import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContentForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  // Using sonner toast
  const isEdit = id !== "new";

  const [formData, setFormData] = useState({
    monthlyPlanId: 1,
    strategyId: 1,
    stage: "topic" as const,
    status: "draft" as const,
    topicTitle: "",
    topicDescription: "",
    planTitle: "",
    platform: "" as any,
    contentFormat: "",
    scheduledDate: "",
    copyBody: "",
    copyHashtags: "",
    copyCta: "",
    mediaUrls: "",
  });

  // Fetch content if editing
  const { data: content } = trpc.content.getById.useQuery(
    { id: parseInt(id!) },
    { enabled: isEdit }
  );

  // Fetch monthly plans for dropdown
  const { data: monthlyPlans } = trpc.monthlyPlans.list.useQuery({});

  // Fetch strategies for dropdown
  const { data: strategies } = trpc.strategies.list.useQuery({});

  useEffect(() => {
    if (content) {
      setFormData({
        monthlyPlanId: content.monthlyPlanId,
        strategyId: content.strategyId,
        stage: content.stage,
        status: content.status,
        topicTitle: content.topicTitle || "",
        topicDescription: content.topicDescription || "",
        planTitle: content.planTitle || "",
        platform: content.platform || "",
        contentFormat: content.contentFormat || "",
        scheduledDate: content.scheduledDate
          ? new Date(content.scheduledDate).toISOString().slice(0, 16)
          : "",
        copyBody: content.copyBody || "",
        copyHashtags: content.copyHashtags || "",
        copyCta: content.copyCta || "",
        mediaUrls: content.mediaUrls || "",
      });
    }
  }, [content]);

  const createMutation = trpc.content.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Content created",
        description: "Content item has been created successfully",
      });
      setLocation("/content");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = trpc.content.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Content updated",
        description: "Content item has been updated successfully",
      });
      setLocation("/content");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitForReviewMutation = trpc.content.submitForReview.useMutation({
    onSuccess: () => {
      toast({
        title: "Submitted for review",
        description: "Content has been submitted for review",
      });
      setLocation("/content");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (submitForReview = false) => {
    const data = {
      ...formData,
      scheduledDate: formData.scheduledDate
        ? new Date(formData.scheduledDate)
        : undefined,
    };

    if (isEdit) {
      if (submitForReview) {
        submitForReviewMutation.mutate({ id: parseInt(id!) });
      } else {
        updateMutation.mutate({ id: parseInt(id!), ...data });
      }
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setLocation("/content")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Content" : "New Content"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="topic" value={formData.stage} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="topic">Topic</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="copy">Copy</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
            </TabsList>

            {/* Topic Tab */}
            <TabsContent value="topic" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPlan">Monthly Plan</Label>
                  <Select
                    value={formData.monthlyPlanId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, monthlyPlanId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select monthly plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthlyPlans?.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Select
                    value={formData.strategyId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, strategyId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies?.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id.toString()}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topicTitle">Topic Title</Label>
                <Input
                  id="topicTitle"
                  value={formData.topicTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, topicTitle: e.target.value })
                  }
                  placeholder="Enter content topic title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topicDescription">Topic Description</Label>
                <Textarea
                  id="topicDescription"
                  value={formData.topicDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, topicDescription: e.target.value })
                  }
                  placeholder="Describe the content idea"
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Plan Tab */}
            <TabsContent value="plan" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="planTitle">Plan Title</Label>
                <Input
                  id="planTitle"
                  value={formData.planTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, planTitle: e.target.value })
                  }
                  placeholder="Enter content plan title"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      setFormData({ ...formData, platform: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="gmb">Google My Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentFormat">Content Format</Label>
                  <Input
                    id="contentFormat"
                    value={formData.contentFormat}
                    onChange={(e) =>
                      setFormData({ ...formData, contentFormat: e.target.value })
                    }
                    placeholder="e.g., Carousel, Video, Article"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* Copy Tab */}
            <TabsContent value="copy" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="copyBody">Copy Body</Label>
                <Textarea
                  id="copyBody"
                  value={formData.copyBody}
                  onChange={(e) =>
                    setFormData({ ...formData, copyBody: e.target.value })
                  }
                  placeholder="Enter the main copy/caption"
                  rows={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="copyHashtags">Hashtags</Label>
                  <Input
                    id="copyHashtags"
                    value={formData.copyHashtags}
                    onChange={(e) =>
                      setFormData({ ...formData, copyHashtags: e.target.value })
                    }
                    placeholder="#hashtag1 #hashtag2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyCta">Call to Action</Label>
                  <Input
                    id="copyCta"
                    value={formData.copyCta}
                    onChange={(e) =>
                      setFormData({ ...formData, copyCta: e.target.value })
                    }
                    placeholder="e.g., Learn More, Book Now"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Creative Tab */}
            <TabsContent value="creative" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mediaUrls">Media URLs</Label>
                <Textarea
                  id="mediaUrls"
                  value={formData.mediaUrls}
                  onChange={(e) =>
                    setFormData({ ...formData, mediaUrls: e.target.value })
                  }
                  placeholder="Enter media URLs (one per line)"
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  Enter image, video, or other media URLs, one per line
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={() => setLocation("/content")}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            {isEdit && formData.status === "draft" && (
              <Button onClick={() => handleSubmit(true)}>
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
