import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stages = [
  { id: "topic", label: "Topic", color: "bg-gray-100" },
  { id: "plan", label: "Plan", color: "bg-blue-100" },
  { id: "copy", label: "Copy", color: "bg-purple-100" },
  { id: "creative", label: "Creative", color: "bg-green-100" },
];

const statusColors = {
  draft: "bg-gray-200 text-gray-800",
  pending_review: "bg-yellow-200 text-yellow-800",
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
};

export default function ContentKanban() {
  const [, setLocation] = useLocation();
  const { data: content, refetch } = trpc.content.list.useQuery({});

  const updateStageMutation = trpc.content.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const approveMutation = trpc.content.approve.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const rejectMutation = trpc.content.reject.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = trpc.content.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDragStart = (e: React.DragEvent, contentId: number) => {
    e.dataTransfer.setData("contentId", contentId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    const contentId = parseInt(e.dataTransfer.getData("contentId"));
    updateStageMutation.mutate({
      id: contentId,
      stage: newStage as any,
    });
  };

  const getContentByStage = (stage: string) => {
    return content?.filter((item) => item.stage === stage) || [];
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage.id)}
        >
          <Card className={stage.color}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {stage.label}
                <Badge variant="secondary">
                  {getContentByStage(stage.id).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getContentByStage(stage.id).map((item) => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className="cursor-move hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {item.platform}: {item.topicTitle || item.planTitle}
                        </h4>
                        <Badge
                          className={`mt-1 text-xs ${
                            statusColors[item.status as keyof typeof statusColors]
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setLocation(`/content/${item.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {item.status === "pending_review" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => approveMutation.mutate({ id: item.id })}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  rejectMutation.mutate({
                                    id: item.id,
                                    reason: "Needs revision",
                                  })
                                }
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => deleteMutation.mutate({ id: item.id })}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {item.topicDescription && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.topicDescription}
                      </p>
                    )}

                    {item.scheduledDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
