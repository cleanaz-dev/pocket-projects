"use client";

import { useState } from "react";
import useSWR from "swr";
import { useStudent } from "@/context/student-context";
import { ProjectWithRelations } from "@/types/project-types";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Youtube,
  Globe,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  FileText,
  ExternalLink,
} from "lucide-react";
import { MOCK_PROJECT } from "./mock-project-data";
import PreviewResearchCard from "./preview-research-card";
import AiAssistantBar from "../assistant/ai-assistant";

interface SingleProjectWrapperProps {
  projectId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SingleProjectWrapper({
  projectId,
}: SingleProjectWrapperProps) {
  const { familyId, getImageUrl } = useStudent();

  // const { data: project, isLoading, error, mutate } = useSWR<ProjectWithRelations>(
  //     familyId ? `/api/family/${familyId}/projects/${projectId}/project-details` : null,
  //     fetcher
  // );

  // TEMPORARY: Use Mock Data
  const project = MOCK_PROJECT;
  const isLoading = false;
  const error = null;
  const mutate = () => {};

  if (isLoading) return <LoadingState />;
  if (error || !project) return <ErrorState retry={() => mutate()} />;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="container mx-auto max-w-4xl p-4 md:p-6">
        {/* 1. HERO SECTION: Image & Title */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-6">
          {/* Cover Image */}
          <div className="relative w-full h-48 md:h-64 bg-slate-200">
            {project.coverImage ? (
              <img
                src={getImageUrl(project.coverImage)}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageIcon className="w-12 h-12 opacity-50" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm bg-white ${
                  project.status === "COMPLETED"
                    ? "text-green-600"
                    : project.status === "IN_PROGRESS"
                      ? "text-blue-600"
                      : "text-slate-500"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Compact Details */}
          <div className="p-6">
            <h1 className="text-3xl md:text-4xl text-primary mb-2 tracking-tight">
              {project.name}
            </h1>

            {/* Shrunk Description */}
            {project.description && (
              <p className="text-slate-500  leading-relaxed ">
                {project.description}
              </p>
            )}

            <div className="flex gap-3 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {project.category && <span>• {project.category}</span>}
              {project.grade && <span>• {project.grade}</span>}
              {project.dueDate && (
                <span>
                  • Due {new Date(project.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. ACTION BAR */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Research Sessions
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
              {project.researches.length}
            </span>
          </h2>

          <button className="group flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="font-medium text-sm">Start New Research</span>
          </button>
        </div>

        {/* 3. RESEARCH LIST (The "Console") */}
        <div className="space-y-4">
          {project.researches.length === 0 ? (
            <EmptyState />
          ) : (
            project.researches.map((research: any) => (
              <PreviewResearchCard key={research.id} research={research} />
            ))
          )}
        </div>
      </div>
      <AiAssistantBar />
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

function ResearchConsoleCard({ research }: { research: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate totals for badges
  const totalWeb = research.webLinks?.length || 0;
  const totalYt = research.ytLinks?.length || 0;
  const totalImg = research.imgLinks?.length || 0;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "ring-2 ring-indigo-500/20 shadow-xl border-indigo-100"
          : "shadow-sm border-slate-100 hover:border-slate-300"
      }`}
    >
      {/* The Clickable Header (Sketch: "research date | docs 0 yt 0... | arrow") */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none bg-white hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {research.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(research.createdAt).toLocaleDateString()}</span>
            </div>
            {research.criteria && (
              <span className="hidden md:inline-block text-slate-300">|</span>
            )}
            {research.criteria && (
              <span className="truncate max-w-[200px]">
                {research.criteria}
              </span>
            )}
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-2">
          <Badge
            icon={<Globe className="w-3 h-3" />}
            count={totalWeb}
            color="bg-blue-50 text-blue-600"
            label="Web"
          />
          <Badge
            icon={<Youtube className="w-3 h-3" />}
            count={totalYt}
            color="bg-red-50 text-red-600"
            label="Video"
          />
          <Badge
            icon={<ImageIcon className="w-3 h-3" />}
            count={totalImg}
            color="bg-purple-50 text-purple-600"
            label="Img"
          />

          <div
            className={`ml-2 p-2 rounded-full transition-transform duration-300 ${isOpen ? "bg-slate-100 rotate-180" : ""}`}
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* The Expanded Console (Sketch: "Expanded research") */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5 md:p-6 animate-in slide-in-from-top-2 duration-200">
          {/* AI Summary Section */}
          <div className="mb-8 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                Research Criteria & Summary
              </h4>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {research.criteria}
            </p>
            {/* Placeholder for AI Summary if exists, or button to generate */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 italic">
                AI summary will appear here based on your collected links...
              </p>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Web Links Column */}
            <ResourceColumn
              title="Websites"
              icon={<Globe className="w-4 h-4" />}
              colorClass="text-blue-600 bg-blue-100"
              items={research.webLinks}
              type="WEB"
            />

            {/* Videos Column */}
            <ResourceColumn
              title="Videos"
              icon={<Youtube className="w-4 h-4" />}
              colorClass="text-red-600 bg-red-100"
              items={research.ytLinks}
              type="VIDEO"
            />

            {/* Images Column */}
            <ResourceColumn
              title="Images"
              icon={<ImageIcon className="w-4 h-4" />}
              colorClass="text-purple-600 bg-purple-100"
              items={research.imgLinks}
              type="IMAGE"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to list resources inside the expanded view
function ResourceColumn({ title, icon, colorClass, items, type }: any) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${colorClass} bg-opacity-20`}>
            {icon}
          </div>
          <span className="font-semibold text-slate-700 text-sm">{title}</span>
        </div>
        <button className="text-xs font-medium text-slate-400 hover:text-slate-700 hover:underline">
          + Add
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 min-h-[120px] p-2">
        {items && items.length > 0 ? (
          <div className="flex flex-col gap-1">
            {items.map((item: any) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group text-sm transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
                <span className="truncate text-slate-600 font-medium">
                  {item.url}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 py-4">
            <Plus className="w-6 h-6 opacity-20" />
            <span className="text-xs">No {title.toLowerCase()} yet</span>
          </div>
        )}
      </div>
       
    </div>
  );
}

function Badge({ icon, count, color, label }: any) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${color} bg-opacity-10 border border-transparent hover:border-current transition-all`}
    >
      {icon}
      <span className="font-bold text-xs">{count}</span>
      <span className="hidden sm:inline text-[10px] font-bold opacity-70 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------
// Loading & Error States
// ----------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse">
          Loading your project...
        </p>
      </div>
    </div>
  );
}

function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-slate-500 mb-6">
          We couldn't load your project details. Please try again.
        </p>
        <button
          onClick={retry}
          className="bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Sparkles className="w-8 h-8 text-yellow-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-1">
        Start your first research!
      </h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
        Gather links, videos, and images to help with your project.
      </p>
    </div>
  );
}
