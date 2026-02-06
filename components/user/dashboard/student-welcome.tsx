"use client";

import { useStudent } from "@/context/student-context";

export default function StudentWelcome() {
  const { name } = useStudent();
  
  const today = new Date();
  
  // Get array of 7 days centered around today
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {name}!</h1>
        <p className="text-lg text-muted-foreground mt-1">{formattedDate}</p>
      </div>
      
      <div className="flex gap-3">
        {weekDays.map((day, index) => {
          const isCurrent = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col items-center justify-center rounded-xl w-16 h-20 transition-all ${
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="text-xs font-medium mb-1">
                {dayNames[index]}
              </span>
              <span className="text-xl font-bold">
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}