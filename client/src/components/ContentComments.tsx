import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ContentCommentsProps {
  contentId: number;
  onStatusChange?: () => void;
}

export default function ContentComments({ contentId, onStatusChange }: ContentCommentsProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contentData, refetch } = trpc.content.get.useQuery({ id: contentId });
  const addCommentMutation = trpc.content.addComment.useMutation();
  const approveMutation = trpc.content.approve.useMutation();

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentMutation.mutateAsync({
        contentId,
        comment: comment.trim()
      });
      setComment("");
      toast.success("Comment added");
      refetch();
    } catch (error: any) {
      toast.error(`Failed to add comment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovalAction = async (action: "approve" | "request_changes" | "reject") => {
    if (!comment.trim() && action !== "approve") {
      toast.error("Please add a comment explaining your decision");
      return;
    }

    setIsSubmitting(true);
    try {
      await approveMutation.mutateAsync({
        contentId,
        action,
        comment: comment.trim() || undefined
      });
      setComment("");
      toast.success(
        action === "approve" ? "Content approved" :
        action === "request_changes" ? "Changes requested" :
        "Content rejected"
      );
      refetch();
      onStatusChange?.();
    } catch (error: any) {
      toast.error(`Failed to ${action}: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionIcon = (action: string | null) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "request_changes":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "reject":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string | null) => {
    switch (action) {
      case "approve":
        return "Approved";
      case "request_changes":
        return "Requested Changes";
      case "reject":
        return "Rejected";
      default:
        return "Commented";
    }
  };

  const comments = contentData?.comments || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments & Approval</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {c.userId.toString().slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">User {c.userId}</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(c.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    {c.action && (
                      <Badge variant="outline" className="ml-auto flex items-center gap-1">
                        {getActionIcon(c.action)}
                        {getActionLabel(c.action)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{c.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="space-y-3 pt-4 border-t">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddComment}
              disabled={isSubmitting || !comment.trim()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Comment
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprovalAction("request_changes")}
              disabled={isSubmitting}
              className="text-orange-600 hover:text-orange-700"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Request Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprovalAction("reject")}
              disabled={isSubmitting}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => handleApprovalAction("approve")}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
