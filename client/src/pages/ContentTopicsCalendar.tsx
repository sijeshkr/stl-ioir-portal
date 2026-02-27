import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Table as TableIcon,
  LayoutGrid,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { TopicDialog } from "@/components/TopicDialog";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";

type ViewMode = "list" | "table" | "calendar" | "kanban";

export default function ContentTopicsCalendar() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState<number | null>(null);
  const [showTopicDialog, setShowTopicDialog] = useState(false);

  // Fetch monthly plans for filter
  const { data: monthlyPlans } = trpc.monthlyPlans.list.useQuery();

  // Fetch calendar topics
  const startDate = format(startOfMonth(selectedMonth), "yyyy-MM-dd");
  const endDate = format(endOfMonth(selectedMonth), "yyyy-MM-dd");
  
  const { data: topics = [], isLoading, refetch } = trpc.contentCalendar.list.useQuery({
    monthlyPlanId: selectedMonthlyPlan || undefined,
    startDate,
    endDate,
  });

  // Auto-generate posts mutation
  const generatePosts = trpc.contentCalendar.generateFromMonthlyPlan.useMutation({
    onSuccess: (result) => {
      alert(`Successfully generated ${result.generated} placeholder posts!`);
      refetch();
    },
    onError: (error) => {
      alert(`Error generating posts: ${error.message}`);
    },
  });

  const handleGeneratePosts = async () => {
    if (!selectedMonthlyPlan) return;
    
    const confirmed = confirm(
      "This will auto-generate placeholder posts from the monthly plan's content scope. Continue?"
    );
    
    if (confirmed) {
      const month = format(selectedMonth, "yyyy-MM");
      await generatePosts.mutateAsync({
        monthlyPlanId: selectedMonthlyPlan,
        month,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "published":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "bg-blue-600 text-white";
      case "facebook":
        return "bg-blue-500 text-white";
      case "instagram":
        return "bg-pink-600 text-white";
      case "twitter":
        return "bg-sky-500 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  // Calendar view helpers
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTopicsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return topics.filter((topic: any) => topic.scheduleddate === dateStr);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Plan daily content topics before creating detailed copies
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleGeneratePosts()}
              disabled={!selectedMonthlyPlan}
            >
              Generate Posts from Plan
            </Button>
            <Button onClick={() => setShowTopicDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </div>
        </div>

        {/* Filters & View Switcher */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedMonthlyPlan?.toString() || "all"}
              onValueChange={(value) =>
                setSelectedMonthlyPlan(value === "all" ? null : parseInt(value))
              }
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Monthly Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Monthly Plans</SelectItem>
                {monthlyPlans?.map((plan: any) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {viewMode === "calendar" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-32 text-center">
                  {format(selectedMonth, "MMMM yyyy")}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonth(new Date())}
                >
                  Today
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <TableIcon className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban
            </Button>
          </div>
        </div>

        {/* Content Views */}
        {viewMode === "list" && (
          <Card className="p-6">
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading topics...</p>
              ) : topics.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No topics planned yet. Click "New Topic" to get started.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Topic</th>
                        <th className="text-left py-3 px-4 font-semibold">Platform</th>
                        <th className="text-left py-3 px-4 font-semibold">Source</th>
                        <th className="text-left py-3 px-4 font-semibold">Audience</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics.map((topic: any) => (
                        <tr key={topic.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {format(new Date(topic.scheduleddate), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3 px-4 font-medium">{topic.topictitle}</td>
                          <td className="py-3 px-4">
                            <Badge className={getPlatformColor(topic.platform)}>
                              {topic.platform}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline"
                              className={topic.source === "monthly_plan" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}
                            >
                              {topic.source === "monthly_plan" ? "Auto-generated" : "Manual"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {topic.audience || "-"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(topic.status)}>
                              {topic.status.replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/content/new?topicId=${topic.id}`)}
                            >
                              Create Content
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        )}

        {viewMode === "calendar" && (
          <Card className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-sm py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day) => {
                const dayTopics = getTopicsForDate(day);
                const isCurrentMonth = isSameMonth(day, selectedMonth);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={`min-h-32 p-2 border rounded-lg ${
                      !isCurrentMonth ? "bg-muted/30" : "bg-background"
                    } ${isCurrentDay ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="text-sm font-medium mb-2">
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayTopics.map((topic: any) => (
                        <div
                          key={topic.id}
                          className="text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer truncate"
                        >
                          <Badge className={`${getPlatformColor(topic.platform)} text-[10px] px-1 py-0 mr-1`}>
                            {topic.platform.slice(0, 2).toUpperCase()}
                          </Badge>
                          {topic.topictitle}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {viewMode === "kanban" && (
          <div className="grid grid-cols-4 gap-4">
            {["planned", "in_progress", "completed", "published"].map((status) => (
              <Card key={status} className="p-4">
                <h3 className="font-semibold mb-4 capitalize">
                  {status.replace("_", " ")}
                </h3>
                <div className="space-y-3">
                  {topics
                    .filter((topic: any) => topic.status === status)
                    .map((topic: any) => (
                      <Card key={topic.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="space-y-2">
                          <Badge className={getPlatformColor(topic.platform)}>
                            {topic.platform}
                          </Badge>
                          <p className="font-medium text-sm">{topic.topictitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(topic.scheduleddate), "MMM dd")}
                          </p>
                          {topic.cta && (
                            <p className="text-xs text-muted-foreground italic">
                              CTA: {topic.cta}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        <TopicDialog
          open={showTopicDialog}
          onOpenChange={setShowTopicDialog}
          onSuccess={() => refetch()}
        />
      </div>
    </DashboardLayout>
  );
}
