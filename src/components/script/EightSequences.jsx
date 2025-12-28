import React, { useState } from 'react';
import { Grid3x3, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

export default function EightSequences({ eight_sequences = [] }) {
  const [expanded, setExpanded] = useState(false);
  
  const displaySequences = expanded ? eight_sequences : eight_sequences.slice(0, 4);

  if (!eight_sequences.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/10 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
          <Grid3x3 className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Eight-Sequence Structure</h3>
          <p className="text-zinc-500 text-sm">Film school method breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {displaySequences.map((seq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/30 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-orange-400">
                      Sequence {seq.sequence_letter || String.fromCharCode(65 + idx)}
                    </span>
                    {seq.page_range && (
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                        {seq.page_range}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-white text-sm">
                    {seq.title || `Sequence ${idx + 1}`}
                  </h4>
                </div>
              </div>

              {seq.narrative_function && (
                <p className="text-xs text-zinc-400 mb-3 italic">
                  {seq.narrative_function}
                </p>
              )}

              {seq.key_scenes && seq.key_scenes.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Key Scenes:</p>
                  <ul className="space-y-1">
                    {seq.key_scenes.map((scene, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="text-orange-500">•</span>
                        <span>{scene}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {eight_sequences.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-zinc-800/50"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All Sequences ({eight_sequences.length - 4} more)
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}