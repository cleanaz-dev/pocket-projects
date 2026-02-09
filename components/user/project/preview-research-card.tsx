"use client";

import { useState } from "react";
import ResearchSummary from "./research-summary";
import {
  ChevronDown,
  Globe,
  Youtube,
  Image as ImageIcon,
  Plus,
  ExternalLink,
  PlayCircle,
  Sparkles,
  Trash2,
  BookOpen,
  Bot,
} from "lucide-react";

// --- Types ---
interface LinkItem {
  id: string;
  url: string;
  summary?: string | null;
  type: "VIDEO" | "WEB" | "IMAGE" | "DOCS" | "PDF";
}

interface ResearchProps {
  research: {
    id: string;
    title: string;
    criteria: string;
    createdAt: Date | string;
    overallSummary?: string | null; // <--- Added this
    webLinks: LinkItem[];
    ytLinks: LinkItem[];
    imgLinks: LinkItem[];
  };
  onDelete?: () => void;
}

// --- Helper: Get YouTube Thumbnail ---
const getYoutubeThumbnail = (url: string) => {
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`
      : null;
  } catch (e) {
    return null;
  }
};

export default function PreviewResearchComponent({ research }: ResearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Counts
  const webCount = research.webLinks?.length || 0;
  const videoCount = research.ytLinks?.length || 0;
  const imgCount = research.imgLinks?.length || 0;

  const allLinks = [
    ...(research.webLinks || []),
    ...(research.ytLinks || []),
    ...(research.imgLinks || []),
  ];

  const handleGenerateSummary = () => {
    // Mock API Call
    setIsGeneratingSummary(true);
    setTimeout(() => setIsGeneratingSummary(false), 2000);
    console.log("Generating summary for research:", research.id);
  };

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "shadow-xl ring-1 ring-indigo-500/10 border-indigo-100"
          : "shadow-sm border-slate-100 hover:border-slate-200"
      }`}
    >
      {/* ================= HEADER (Collapsed View) ================= */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none bg-white relative z-10"
      >
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {research.title}
          </h3>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
            <span>{new Date(research.createdAt).toLocaleDateString()}</span>
            {!isOpen && research.overallSummary && (
              <>
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-600 font-semibold">
                  Summary Available
                </span>
              </>
            )}
            {!isOpen && research.criteria && !research.overallSummary && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="truncate max-w-[200px] md:max-w-[400px] text-slate-500">
                  {research.criteria}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <StatusPill
              icon={<Youtube size={14} />}
              count={videoCount}
              color="red"
            />
            <StatusPill
              icon={<Globe size={14} />}
              count={webCount}
              color="blue"
            />
            <StatusPill
              icon={<ImageIcon size={14} />}
              count={imgCount}
              color="purple"
            />
          </div>

          <button
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-slate-100 rotate-180 text-slate-900" : "text-slate-400 group-hover:bg-slate-50"}`}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* ================= BODY (Expanded View) ================= */}
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300 ease-out">
          {/* 1. INFO BAR (Criteria) */}
          <div className="px-6 py-3 bg-slate-50 border-y border-slate-100 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Goal:
            </span>
            <p className="text-sm text-slate-600 font-medium">
              {research.criteria || "No specific criteria set."}
            </p>
          </div>

          <div className="p-6 space-y-8 bg-white">
            {/* 2. SUMMARY SECTION (The "Notebook") */}
            <ResearchSummary
              summary={research.overallSummary}
              isGenerating={isGeneratingSummary}
              allLinks={allLinks} // <--- Pass this new prop
              onGenerate={handleGenerateSummary}
              onEdit={() => console.log("Edit clicked")}
            />

            <div className="h-px bg-slate-100 w-full" />

            {/* 3. RESOURCES GRID (The Console) */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Col: Read & Watch */}
              <div className="space-y-8">
                {/* VIDEOS */}
                <section>
                  <SectionHeader
                    title="Watch"
                    icon={<Youtube size={16} />}
                    color="text-red-500"
                    action="Add Video"
                  />
                  {research.ytLinks.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {research.ytLinks.map((link) => (
                        <VideoCard key={link.id} link={link} />
                      ))}
                    </div>
                  ) : (
                    <EmptySection text="No videos" />
                  )}
                </section>

                {/* WEB */}
                <section>
                  <SectionHeader
                    title="Read"
                    icon={<Globe size={16} />}
                    color="text-blue-500"
                    action="Add Link"
                  />
                  {research.webLinks.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {research.webLinks.map((link) => (
                        <WebCard key={link.id} link={link} />
                      ))}
                    </div>
                  ) : (
                    <EmptySection text="No articles" />
                  )}
                </section>
              </div>

              {/* Right Col: Images (Visuals need space) */}
              <section>
                <SectionHeader
                  title="Visuals"
                  icon={<ImageIcon size={16} />}
                  color="text-purple-500"
                  action="Add Image"
                />
                {research.imgLinks.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {research.imgLinks.map((link) => (
                      <ImageCard key={link.id} link={link} />
                    ))}
                  </div>
                ) : (
                  <EmptySection text="No images" />
                )}
              </section>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Session ID: {research.id.slice(-6)}
            </span>
            <button className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors">
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= SUB-COMPONENTS =================

function StatusPill({
  icon,
  count,
  color,
}: {
  icon: any;
  count: number;
  color: "red" | "blue" | "purple";
}) {
  const colorStyles = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md ${colorStyles[color]}`}
    >
      {icon}
      <span className="text-xs font-bold">{count}</span>
    </div>
  );
}

function SectionHeader({ title, icon, color, action }: any) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className={`flex items-center gap-2 font-bold text-sm ${color}`}>
        {icon}
        <span className="text-slate-800">{title}</span>
      </div>
      <button className="text-xs font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 rounded-md transition-all">
        <Plus size={14} />
      </button>
    </div>
  );
}

function VideoCard({ link }: { link: LinkItem }) {
  const thumb = getYoutubeThumbnail(link.url);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="flex gap-3 group"
    >
      <div className="relative w-24 h-16 bg-slate-900 rounded-lg overflow-hidden shrink-0">
        {thumb && (
          <img
            src={thumb}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="text-white w-6 h-6 opacity-80" />
        </div>
      </div>
      <div className="flex-1 min-w-0 py-1">
        <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
          {link.summary || "Watch Video"}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">YouTube</p>
      </div>
    </a>
  );
}

function WebCard({ link }: { link: LinkItem }) {
  const domain = new URL(link.url).hostname.replace("www.", "");
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
    >
      <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-600 rounded-md shrink-0">
        <Globe size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-700">
          {link.summary || domain}
        </h5>
        <p className="text-[10px] text-slate-400 truncate">{domain}</p>
      </div>
    </a>
  );
}

function ImageCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="block aspect-square rounded-lg overflow-hidden border border-slate-100 relative group"
    >
      <img
        src={link.url}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
    </a>
  );
}

function EmptySection({ text }: { text: string }) {
  return (
    <div className="py-4 border border-dashed border-slate-200 rounded-lg text-center text-[10px] text-slate-400">
      {text}
    </div>
  );
}
