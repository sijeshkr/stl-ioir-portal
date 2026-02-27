import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ContentKanban from "./ContentKanban";
import ContentCalendar from "./ContentCalendar";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Users, Briefcase, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  LayoutGrid,
  List,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
  FileText,
  PenTool,
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";

const stageIcons = {
  topic: Lightbulb,
  plan: FileText,
  copy: PenTool,
  creative: ImageIcon
};

const stageColors = {
  topic: "bg-purple-100 text-purple-800 border-purple-200",
  plan: "bg-blue-100 text-blue-800 border-blue-200",
  copy: "bg-green-100 text-green-800 border-green-200",
  creative: "bg-orange-100 text-orange-800 border-orange-200"
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

export default function Content() {
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<"calendar" | "kanban" | "list">("list");
  const [selectedStage, setSelectedStage] = useState<"all" | "topic" | "plan" | "copy" | "creative">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "draft" | "pending_approval" | "approved" | "rejected">("all");

  // For now, hardcode clientId and monthlyPlanId
  // In production, these would come from URL params or context
  const clientId = 1;
  const monthlyPlanId = 1;

  const { data: contentItems, isLoading, refetch } = trpc.content.list.useQuery({
    monthlyPlanId,
    stage: selectedStage,
    status: selectedStatus
  });

  // Fetch brand elements for tag display
  const { data: personas } = trpc.personas.list.useQuery();
  const { data: services } = trpc.services.list.useQuery();
  const { data: conditions } = trpc.conditions.list.useQuery();

  // Helper function to get tag name by ID
  const getTagName = (tagType: string, tagId: number) => {
    if (tagType === 'persona') {
      return personas?.find(p => p.id === tagId)?.name || `Persona #${tagId}`;
    } else if (tagType === 'service') {
      return services?.find(s => s.id === tagId)?.name || `Service #${tagId}`;
    } else if (tagType === 'condition') {
      return conditions?.find(c => c.id === tagId)?.name || `Condition #${tagId}`;
    }
    return '';
  };

  const deleteContent = trpc.content.delete.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      await deleteContent.mutateAsync({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Planning</h1>
          <p className="text-gray-600 mt-1">Manage content through the 4-stage workflow</p>
        </div>
        <Button onClick={() => navigate("/content/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button
          variant={viewMode === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("kanban")}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Kanban
        </Button>
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("calendar")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Stage:</label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Stages</option>
            <option value="topic">Topic</option>
            <option value="plan">Plan</option>
            <option value="copy">Copy</option>
            <option value="creative">Creative</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Content Views */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading content...</div>
          ) : !contentItems || contentItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No content items yet</p>
                <Button onClick={() => navigate("/content/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {contentItems.map((item) => {
                const StageIcon = stageIcons[item.stage as keyof typeof stageIcons];
                const platforms = item.platform ? [item.platform] : [];

                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${stageColors[item.stage as keyof typeof stageColors]}`}>
                              <StageIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.topicTitle || "Untitled"}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                                  {item.status.replace("_", " ")}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {item.stage}
                                </Badge>
                                {item.scheduledDate && (
                                  <span className="text-sm text-gray-500">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {format(new Date(item.scheduledDate), "MMM d, yyyy")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {platforms.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">Platforms:</span>
                              {platforms.map((platform: string) => (
                                <Badge key={platform} variant="secondary" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {item.topicDescription && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.topicDescription}</p>
                          )}

                          {/* Brand Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              {item.tags.filter((tag: any) => tag.tagType === 'persona').length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-blue-600" />
                                  {item.tags
                                    .filter((tag: any) => tag.tagType === 'persona')
                                    .map((tag: any) => (
                                      <Badge key={tag.id} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        {getTagName('persona', tag.tagId)}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                              {item.tags.filter((tag: any) => tag.tagType === 'service').length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3 text-green-600" />
                                  {item.tags
                                    .filter((tag: any) => tag.tagType === 'service')
                                    .map((tag: any) => (
                                      <Badge key={tag.id} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        {getTagName('service', tag.tagId)}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                              {item.tags.filter((tag: any) => tag.tagType === 'condition').length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Heart className="h-3 w-3 text-pink-600" />
                                  {item.tags
                                    .filter((tag: any) => tag.tagType === 'condition')
                                    .map((tag: any) => (
                                      <Badge key={tag.id} variant="outline" className="text-xs bg-pink-50 text-pink-700 border-pink-200">
                                        {getTagName('condition', tag.tagId)}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/content/${item.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/content/${item.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {viewMode === "kanban" && (
        <Card>
          <CardContent className="p-6">
            <ContentKanban />
          </CardContent>
        </Card>
      )}

      {viewMode === "calendar" && (
        <Card>
          <CardContent className="p-6">
            <ContentCalendar />
          </CardContent>
        </Card>
      )}
    </div>
    </DashboardLayout>
  );
}
