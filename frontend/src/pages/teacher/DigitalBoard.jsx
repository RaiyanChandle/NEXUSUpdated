import { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { 
    Share2, 
    Download, 
    Trash2, 
    Copy, 
    Check,
    X,
    Maximize2,
    Minimize2
} from "lucide-react";

export default function DigitalBoard() {
    const excalidrawApiRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Auto-save to localStorage every 30 seconds
        const autoSaveInterval = setInterval(() => {
            handleAutoSave();
        }, 30000);

        // Load saved drawing on mount
        loadSavedDrawing();

        return () => clearInterval(autoSaveInterval);
    }, []);

    const loadSavedDrawing = () => {
        try {
            const saved = localStorage.getItem("nexus_digital_board");
            if (saved && excalidrawApiRef.current) {
                const data = JSON.parse(saved);
                excalidrawApiRef.current.updateScene(data);
            }
        } catch (error) {
            console.error("Failed to load saved drawing:", error);
        }
    };

    const handleAutoSave = () => {
        if (!excalidrawApiRef.current) return;
        try {
            const elements = excalidrawApiRef.current.getSceneElements();
            const appState = excalidrawApiRef.current.getAppState();
            const files = excalidrawApiRef.current.getFiles();
            
            const data = {
                elements,
                appState: {
                    viewBackgroundColor: appState.viewBackgroundColor,
                    currentItemStrokeColor: appState.currentItemStrokeColor,
                    currentItemBackgroundColor: appState.currentItemBackgroundColor,
                    currentItemFillStyle: appState.currentItemFillStyle,
                    currentItemStrokeWidth: appState.currentItemStrokeWidth,
                    currentItemRoughness: appState.currentItemRoughness,
                    currentItemOpacity: appState.currentItemOpacity,
                },
                files
            };
            
            localStorage.setItem("nexus_digital_board", JSON.stringify(data));
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
    };

    const handleShare = () => {
        if (!excalidrawApiRef.current) return;
        
        try {
            const elements = excalidrawApiRef.current.getSceneElements();
            const appState = excalidrawApiRef.current.getAppState();
            const files = excalidrawApiRef.current.getFiles();
            
            const data = {
                elements,
                appState: {
                    viewBackgroundColor: appState.viewBackgroundColor,
                },
                files
            };
            
            // Create a shareable JSON string
            const shareableData = JSON.stringify(data);
            const base64Data = btoa(shareableData);
            
            setShareData({
                raw: shareableData,
                encoded: base64Data,
                url: `${window.location.origin}/teacher/digital-board?share=${base64Data}`
            });
            
            setShowShareModal(true);
        } catch (error) {
            console.error("Failed to create share data:", error);
            alert("Failed to generate share link");
        }
    };

    const handleCopyShareLink = async () => {
        if (!shareData) return;
        
        try {
            await navigator.clipboard.writeText(shareData.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
            alert("Failed to copy to clipboard");
        }
    };

    const handleCopyShareCode = async () => {
        if (!shareData) return;
        
        try {
            await navigator.clipboard.writeText(shareData.encoded);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
            alert("Failed to copy to clipboard");
        }
    };

    const handleDownload = () => {
        if (!excalidrawApiRef.current) return;
        
        try {
            const elements = excalidrawApiRef.current.getSceneElements();
            const appState = excalidrawApiRef.current.getAppState();
            const files = excalidrawApiRef.current.getFiles();
            
            const data = {
                type: "excalidraw",
                version: 2,
                source: "nexus-digital-board",
                elements,
                appState,
                files
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `nexus-board-${new Date().toISOString().split('T')[0]}.excalidraw`;
            
            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download");
        }
    };

    const handleClear = () => {
        if (!excalidrawApiRef.current) return;
        
        const confirmed = window.confirm("Are you sure you want to clear the entire board?");
        if (confirmed) {
            excalidrawApiRef.current.resetScene();
            localStorage.removeItem("nexus_digital_board");
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Load shared drawing from URL parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const shareCode = urlParams.get('share');
        
        if (shareCode && excalidrawApiRef.current) {
            try {
                const decoded = atob(shareCode);
                const data = JSON.parse(decoded);
                excalidrawApiRef.current.updateScene(data);
            } catch (error) {
                console.error("Failed to load shared drawing:", error);
            }
        }
    }, []);

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} flex flex-col bg-white dark:bg-neutral-900`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Digital Board</h1>
                        <p className="text-sm text-white/80">Draw, collaborate, and share</p>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                        title="Toggle Theme"
                    >
                        {theme === "dark" ? "🌙" : "☀️"}
                        <span className="hidden lg:inline">Theme</span>
                    </button>
                    
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                        title="Share Board"
                    >
                        <Share2 size={18} />
                        <span className="hidden md:inline">Share</span>
                    </button>
                    
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                        title="Download"
                    >
                        <Download size={18} />
                        <span className="hidden lg:inline">Download</span>
                    </button>
                    
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-all duration-200"
                        title="Clear Board"
                    >
                        <Trash2 size={18} />
                        <span className="hidden lg:inline">Clear</span>
                    </button>
                    
                    <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Auto-save indicator */}
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Auto-saving every 30 seconds
            </div>

            {/* Canvas */}
            <div className="flex-1 min-h-0 relative">
                <Excalidraw
                    excalidrawAPI={(api) => {
                        excalidrawApiRef.current = api;
                    }}
                    theme={theme}
                    initialData={{
                        appState: {
                            viewBackgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                        }
                    }}
                />
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Share Digital Board</h3>
                            <button
                                onClick={() => {
                                    setShowShareModal(false);
                                    setCopied(false);
                                }}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-neutral-600 dark:text-neutral-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Share Link */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Share Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareData?.url || ""}
                                        className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white text-sm font-mono"
                                    />
                                    <button
                                        onClick={handleCopyShareLink}
                                        className="flex items-center gap-2 px-4 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    Anyone with this link can view your board
                                </p>
                            </div>

                            {/* Share Code */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    Share Code
                                </label>
                                <div className="flex gap-2">
                                    <textarea
                                        readOnly
                                        value={shareData?.encoded || ""}
                                        rows={3}
                                        className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white text-sm font-mono resize-none"
                                    />
                                    <button
                                        onClick={handleCopyShareCode}
                                        className="flex items-center gap-2 px-4 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors h-fit"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    Share this code with others to import your board
                                </p>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    📚 How to Share
                                </h4>
                                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                                    <li>Copy the share link and send it to students or colleagues</li>
                                    <li>Recipients can open the link to view your board instantly</li>
                                    <li>Use the share code for manual import if needed</li>
                                    <li>All sharing is done through the frontend - no database storage</li>
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <button
                                onClick={() => {
                                    setShowShareModal(false);
                                    setCopied(false);
                                }}
                                className="px-6 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-lg transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
