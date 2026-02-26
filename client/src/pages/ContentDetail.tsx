import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import ContentComments from "@/components/ContentComments";

export default function ContentDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const contentId = parseInt(params.id || "0");

  const { data: content, isLoading, refetch } = trpc.content.get.useQuery({ id: contentId });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-gray-500">Content not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const stageColors = {
    topic: "bg-purple-100 text-purple-800",
    plan: "bg-blue-100 text-blue-800",
    copy: "bg-green-100 text-green-800",
    creative: "bg-orange-100 text-orange-800",
    scheduled: "bg-indigo-100 text-indigo-800",
    published: "bg-gray-100 text-gray-800"
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    pending_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    needs_revision: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-800"
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/content")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{content.topicTitle || "Untitled Content"}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={stageColors[content.stage]}>
                {content.stage.charAt(0).toUpperCase() + content.stage.slice(1)}
              </Badge>
              <Badge className={statusColors[content.status]}>
                {content.status.replace(/_/g, " ").charAt(0).toUpperCase() + content.status.replace(/_/g, " ").slice(1)}
              </Badge>
              {content.platform && (
                <Badge variant="outline">{content.platform}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic */}
            {content.topicTitle && (
              <Card>
                <CardHeader>
                  <CardTitle>Topic</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{content.topicTitle}</h3>
                  {content.topicDescription && (
                    <p className="text-sm text-gray-600">{content.topicDescription}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Plan */}
            {content.planTitle && (
              <Card>
                <CardHeader>
                  <CardTitle>Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Title:</span>
                    <p className="text-sm text-gray-600">{content.planTitle}</p>
                  </div>
                  {content.contentFormat && (
                    <div>
                      <span className="text-sm font-medium">Format:</span>
                      <p className="text-sm text-gray-600">{content.contentFormat}</p>
                    </div>
                  )}
                  {content.scheduledDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(content.scheduledDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Copy */}
            {content.copyBody && (
              <Card>
                <CardHeader>
                  <CardTitle>Copy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Body:</span>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap mt-1">{content.copyBody}</p>
                  </div>
                  {content.copyHashtags && (
                    <div>
                      <span className="text-sm font-medium">Hashtags:</span>
                      <p className="text-sm text-gray-600">{content.copyHashtags}</p>
                    </div>
                  )}
                  {content.copyCta && (
                    <div>
                      <span className="text-sm font-medium">CTA:</span>
                      <p className="text-sm text-gray-600">{content.copyCta}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Creative */}
            {content.mediaUrls && (
              <Card>
                <CardHeader>
                  <CardTitle>Creative Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {JSON.parse(content.mediaUrls).length} media file(s)
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Created by User {content.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {format(new Date(content.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <ContentComments 
              contentId={contentId} 
              onStatusChange={() => refetch()}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
