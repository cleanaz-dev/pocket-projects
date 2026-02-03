"use client";

import { UserCircle, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, otherwise remove this wrapper

interface FloatingStepHeaderProps {
  step: number;
}

export function FloatingStepHeader({ step }: FloatingStepHeaderProps) {
  const steps = [
    {
      id: 1,
      icon: UserCircle,
      title: "Parent Account",
      subtitle: "Setup your profile",
    },
    {
      id: 2,
      icon: Users,
      title: "Child Account",
      subtitle: "Create child login",
    },
    {
      id: 3,
      icon: Sparkles,
      title: "All Set!",
      subtitle: "Ready to explore",
    },
  ];

  const currentStepInfo = steps.find((s) => s.id === step) || steps[0];
  const Icon = currentStepInfo.icon;

  return (
    <div className="relative mb-8 w-full">
      {/* Main Floating Card */}
      <div className="">
        
        <div className="flex items-center justify-between px-4 py-3">
          
          {/* Left: Icon & Text */}
          <div className="flex items-center gap-4">
            {/* Soft Icon Container */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5 transition-all duration-500 ease-in-out">
              <Icon className="h-6 w-6 transition-all" />
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold tracking-tight text-foreground transition-all duration-300">
                {currentStepInfo.title}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {currentStepInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Premium Step Indicators */}
          <div className="flex items-center gap-2">
            {steps.map((s) => {
              const isActive = s.id === step;
              const isCompleted = s.id < step;

              return (
                <div key={s.id} className="relative flex items-center justify-center">
                  {/* Connector Line (hidden for first item) */}
                  {s.id !== 1 && (
                    <div 
                      className={cn(
                        "absolute right-full mr-2 h-[2px] w-3 rounded-full transition-colors duration-300",
                        isActive || isCompleted ? "bg-primary" : "bg-muted"
                      )} 
                    />
                  )}
                  
                  {/* Dot */}
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all duration-500",
                      isActive 
                        ? "scale-125 bg-primary shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-primary/40" 
                        : isCompleted 
                        ? "bg-primary/60" 
                        : "bg-muted"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional: Very subtle progress bar at the very bottom */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-muted/30">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}