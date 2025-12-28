import React, { useState } from 'react';
import { Maximize2, Minimize2, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFViewer({ fileUrl, isMinimized, onToggleMinimize }) {
  const [zoom, setZoom] = useState(100);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '60px', opacity: 1 }}
        className="bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMinimize}
          className="text-zinc-400 hover:text-white"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
        <div className="mt-4 -rotate-90 whitespace-nowrap text-xs text-zinc-500 font-medium">
          Script
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '50%', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="bg-zinc-900 border-r border-zinc-800 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h3 className="font-semibold text-white">Script</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="text-zinc-400 hover:text-white h-8 w-8"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-zinc-500 w-12 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="text-zinc-400 hover:text-white h-8 w-8"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMinimize}
            className="text-zinc-400 hover:text-white h-8 w-8"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-zinc-950 p-4">
        <iframe
          src={`${fileUrl}#zoom=${zoom}`}
          className="w-full h-full border-0 rounded-lg"
          style={{ minHeight: '100vh' }}
        />
      </div>
    </motion.div>
  );
}