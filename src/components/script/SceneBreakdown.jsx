import React, { useState } from 'react';
import { Film, MapPin, Users, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function SceneBreakdown({ scenes = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredScenes = scenes.filter(scene => 
    scene.slugline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scene.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scene.characters_present?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayScenes = expanded ? filteredScenes : filteredScenes.slice(0, 10);

  if (!scenes.length) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Film className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Scene Breakdown</h3>
        </div>
        <p className="text-zinc-500 text-sm">No scenes extracted</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Film className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Scene Breakdown</h3>
            <p className="text-zinc-500 text-sm">{scenes.length} scenes</p>
          </div>
        </div>
      </div>

      {scenes.length > 10 && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search scenes, locations, or characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {displayScenes.map((scene, idx) => (
            <motion.div
              key={scene.scene_number || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.02 }}
              className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/30 hover:border-zinc-600/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-400">
                    {scene.scene_number || idx + 1}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-blue-300 truncate">
                        {scene.slugline}
                      </p>
                      {scene.location && (
                        <p className="text-xs text-zinc-500 mt-1">
                          {scene.location}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {scene.int_ext && (
                        <Badge variant="outline" className={`
                          text-xs border
                          ${scene.int_ext === 'INT' 
                            ? 'border-cyan-500/30 text-cyan-400' 
                            : 'border-emerald-500/30 text-emerald-400'
                          }
                        `}>
                          {scene.int_ext}
                        </Badge>
                      )}
                      {scene.time_of_day && (
                        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                          {scene.time_of_day}
                        </Badge>
                      )}
                      {scene.page_number && (
                        <span className="text-xs text-zinc-500">
                          p.{scene.page_number}
                        </span>
                      )}
                    </div>
                  </div>

                  {scene.summary && (
                    <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                      {scene.summary}
                    </p>
                  )}

                  {scene.characters_present?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Users className="w-3 h-3 text-zinc-500" />
                      {scene.characters_present.slice(0, 5).map((char, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-zinc-700/50 text-zinc-300 rounded">
                          {char}
                        </span>
                      ))}
                      {scene.characters_present.length > 5 && (
                        <span className="text-xs text-zinc-500">
                          +{scene.characters_present.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredScenes.length > 10 && (
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
              Show All ({filteredScenes.length - 10} more scenes)
            </>
          )}
        </button>
      )}
    </div>
  );
}