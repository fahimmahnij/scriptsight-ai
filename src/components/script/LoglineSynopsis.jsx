import React from 'react';
import { Lightbulb, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoglineSynopsis({ logline, synopsis }) {
  if (!logline && !synopsis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/10 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Story Overview</h3>
      </div>

      {logline && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-indigo-300">Logline</span>
          </div>
          <p className="text-white text-lg leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-500/5 rounded-r-lg">
            "{logline}"
          </p>
        </div>
      )}

      {synopsis && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Synopsis</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            {synopsis}
          </p>
        </div>
      )}
    </motion.div>
  );
}