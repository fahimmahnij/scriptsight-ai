import React, { useState } from 'react';
import { Compass, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

const journeyStages = [
  "Ordinary World", "Call to Adventure", "Refusal of the Call", "Meeting the Mentor",
  "Crossing the Threshold", "Tests, Allies, Enemies", "Approach to the Inmost Cave",
  "Ordeal", "Reward", "The Road Back", "Resurrection", "Return with the Elixir"
];

export default function HerosJourney({ heros_journey = [] }) {
  const [expanded, setExpanded] = useState(false);
  
  const displayStages = expanded ? heros_journey : heros_journey.slice(0, 6);

  if (!heros_journey.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-950/10 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Compass className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Hero's Journey</h3>
          <p className="text-zinc-500 text-sm">12-stage monomyth structure</p>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayStages.map((stage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: idx * 0.05 }}
              className="relative pl-8 pb-4 border-l-2 border-purple-500/30 last:border-0"
            >
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500/30 border-2 border-purple-500" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-400">Stage {idx + 1}</span>
                    <h4 className="font-semibold text-white">{stage.stage}</h4>
                  </div>
                  
                  {stage.page_range && (
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs mb-2">
                      {stage.page_range}
                    </Badge>
                  )}
                  
                  {stage.scene_reference && (
                    <p className="text-sm text-zinc-300 mb-1">
                      <span className="text-zinc-500">Scene:</span> {stage.scene_reference}
                    </p>
                  )}
                  
                  {stage.narrative_purpose && (
                    <p className="text-sm text-zinc-400">
                      {stage.narrative_purpose}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {heros_journey.length > 6 && (
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
              Show All Stages ({heros_journey.length - 6} more)
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}