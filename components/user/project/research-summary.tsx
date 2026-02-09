"use client";

import ReactMarkdown from "react-markdown";
import { 
    BookOpen, 
    Bot, 
    Sparkles, 
    Pencil, 
    RefreshCw, 
    Copy, 
    Check,
    ChevronRight,
    Youtube,
    Globe,
    Image as ImageIcon,
    FileText,
    ExternalLink
} from "lucide-react";
import { useState } from "react";

// Reuse your LinkItem type
interface LinkItem {
    id: string;
    url: string;
    summary?: string | null;
    type: "VIDEO" | "WEB" | "IMAGE" | "DOCS" | "PDF";
}

interface ResearchSummaryProps {
    summary?: string | null;
    isGenerating?: boolean;
    allLinks?: LinkItem[]; // <--- New Prop: To look up source details
    onGenerate?: () => void;
    onEdit?: () => void;
}

export default function ResearchSummary({ 
    summary, 
    isGenerating = false,
    allLinks = [],
    onGenerate,
    onEdit 
}: ResearchSummaryProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (summary) {
            navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section className="group/notebook relative transition-all duration-500">
            {/* Background Blob */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-orange-50 rounded-2xl blur opacity-25 group-hover/notebook:opacity-50 transition duration-1000"></div>

            <div className="relative bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                
                {/* Header Toolbar */}
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-lg shadow-sm shadow-orange-200">
                            <BookOpen size={14} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-700 leading-none">Smart Summary</h4>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">AI Notebook</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {summary && (
                            <>
                                <ActionButton 
                                    onClick={handleCopy} 
                                    icon={copied ? <Check size={12}/> : <Copy size={12}/>} 
                                    label={copied ? "Copied" : "Copy"} 
                                />
                                <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                <ActionButton onClick={onEdit} icon={<Pencil size={12}/>} label="Edit" />
                                <ActionButton onClick={onGenerate} icon={<RefreshCw size={12}/>} label="Update" />
                            </>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative min-h-[160px] p-6 bg-gradient-to-b from-white to-slate-50/30">
                    
                    {isGenerating && (
                        <div className="absolute inset-0 z-20 bg-white/90 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
                                <Sparkles className="text-indigo-500 relative z-10 animate-pulse" size={20} />
                                <div className="absolute inset-0 bg-indigo-200 animate-ping opacity-20"></div>
                            </div>
                            <h5 className="font-bold text-slate-800 mb-1">Synthesizing Research...</h5>
                            <p className="text-xs text-slate-400 max-w-[200px] animate-pulse">Reading links and connecting facts.</p>
                        </div>
                    )}

                    {summary ? (
                        <div className="prose prose-sm prose-slate max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({...props}) => <h3 className="text-lg font-black text-slate-800 mb-3 mt-4 flex items-center gap-2" {...props} />,
                                    h2: ({...props}) => <h4 className="text-base font-bold text-slate-700 mb-2 mt-4 border-b border-slate-100 pb-1" {...props} />,
                                    h3: ({...props}) => <h5 className="text-sm font-bold text-slate-700 mb-1 mt-3 uppercase tracking-wide" {...props} />,
                                    p: ({...props}) => <p className="text-slate-600 leading-relaxed mb-3 text-[15px]" {...props} />,
                                    strong: ({...props}) => <strong className="font-bold text-slate-800 bg-amber-50 px-1 rounded-sm text-shadow-sm" {...props} />,
                                    li: ({children}) => (
                                        <li className="flex items-start gap-2 mb-2 text-slate-600 pl-0">
                                            <span className="mt-1.5 shrink-0 text-amber-500"><ChevronRight size={14} strokeWidth={3} /></span>
                                            <span className="flex-1 leading-relaxed">{children}</span>
                                        </li>
                                    ),
                                    blockquote: ({...props}) => <blockquote className="border-l-4 border-amber-300 bg-amber-50/50 pl-4 py-2 italic text-slate-600 my-4 rounded-r-lg" {...props} />,
                                    
                                    // === CUSTOM LINK RENDERER FOR CITATIONS ===
                                    a: ({href, children}) => {
                                        // Check if this is a special source link
                                        if (href?.startsWith('source:')) {
                                            const sourceId = href.split(':')[1];
                                            const source = allLinks.find(l => l.id === sourceId);
                                            
                                            // If source found, render Chip
                                            if (source) {
                                                return <CitationChip source={source} text={children} />;
                                            }
                                        }
                                        // Fallback to standard link
                                        return <a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{children}</a>;
                                    }
                                }}
                            >
                                {summary}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <EmptyState onGenerate={onGenerate} isGenerating={isGenerating} />
                    )}
                </div>
                
                {summary && (
                    <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                         <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <Bot size={10} />
                            Generated by AI • Sources cited automatically
                         </span>
                    </div>
                )}
            </div>
        </section>
    );
}

// === CITATION CHIP COMPONENT ===
function CitationChip({ source, text }: { source: LinkItem, text: React.ReactNode }) {
    // Determine icon and color based on type
    let Icon = Globe;
    let colorClass = "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100";
    
    if (source.type === 'VIDEO') {
        Icon = Youtube;
        colorClass = "bg-red-50 text-red-600 border-red-100 hover:bg-red-100";
    } else if (source.type === 'IMAGE') {
        Icon = ImageIcon;
        colorClass = "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100";
    }

    return (
        <a 
            href={source.url} 
            target="_blank" 
            rel="noreferrer"
            className={`
                inline-flex items-center gap-1.5 px-2 py-0.5 mx-1 rounded-full border 
                text-[11px] font-bold no-underline align-middle transition-all cursor-pointer
                ${colorClass}
            `}
            title={`Go to source: ${source.url}`}
        >
            <Icon size={10} />
            <span className="truncate max-w-[100px]">{text}</span>
            <ExternalLink size={8} className="opacity-50" />
        </a>
    );
}

function ActionButton({ onClick, icon, label }: any) {
    return (
        <button onClick={onClick} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-700 transition-all text-[11px] font-semibold group">
            <span className="group-hover:scale-110 transition-transform">{icon}</span>
            {label}
        </button>
    );
}

function EmptyState({ onGenerate, isGenerating }: any) {
    return (
        <div className="h-full flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 group-hover/notebook:scale-110 transition-transform duration-300">
                <Bot size={28} className="text-slate-300" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Ready to Summarize?</h4>
            <p className="text-xs text-slate-400 text-center max-w-[260px] leading-relaxed mb-6">
                I can read your collected links and write a summary, key findings, and vocabulary list for you.
            </p>
            <button onClick={onGenerate} disabled={isGenerating} className="group relative overflow-hidden rounded-full bg-slate-900 px-6 py-2.5 transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200 hover:-translate-y-0.5 active:scale-95">
                <span className="relative z-10 flex items-center gap-2 text-xs font-bold text-white"><Sparkles size={14} /> Generate AI Summary</span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </button>
        </div>
    );
}