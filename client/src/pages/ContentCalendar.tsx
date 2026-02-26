import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const stageColors = {
  topic: "bg-gray-500",
  plan: "bg-blue-500",
  copy: "bg-purple-500",
  creative: "bg-green-500",
};

export default function ContentCalendar() {
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: content } = trpc.content.list.useQuery({});

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getContentForDate = (date: Date | null) => {
    if (!date || !content) return [];
    return content.filter((item) => {
      if (!item.scheduledDate) return false;
      const itemDate = new Date(item.scheduledDate);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm text-gray-600 p-2"
          >
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          const dayContent = getContentForDate(date);
          const isToday =
            date &&
            date.toDateString() === new Date().toDateString();

          return (
            <Card
              key={index}
              className={`min-h-[120px] ${
                !date ? "bg-gray-50" : isToday ? "border-primary border-2" : ""
              }`}
            >
              <CardContent className="p-2 space-y-1">
                {date && (
                  <>
                    <div
                      className={`text-sm font-semibold ${
                        isToday ? "text-primary" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayContent.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setLocation(`/content/${item.id}`)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <Badge
                            className={`text-xs w-full justify-start truncate ${
                              stageColors[item.stage as keyof typeof stageColors]
                            } text-white`}
                          >
                            {item.platform}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
