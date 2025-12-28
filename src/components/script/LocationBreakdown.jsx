import React, { useState } from 'react';
import { MapPin, Sun, Moon, Sunrise, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

export default function LocationBreakdown({ locations = [] }) {
  const [expanded, setExpanded] = useState(false);
  
  const interiors = locations.filter(l => l.int_ext === 'INT');
  const exteriors = locations.filter(l => l.int_ext === 'EXT');
  const dayScenes = locations.filter(l => l.time_of_day?.toUpperCase().includes('DAY')).length;
  const nightScenes = locations.filter(l => l.time_of_day?.toUpperCase().includes('NIGHT')).length;
  
  const displayLocations = expanded ? locations : locations.slice(0, 6);

  const getTimeIcon = (time) => {
    if (!time) return <Sun className="w-3 h-3" />;
    const t = time.toUpperCase();
    if (t.includes('NIGHT')) return <Moon className="w-3 h-3" />;
    if (t.includes('DUSK') || t.includes('DAWN')) return <Sunrise className="w-3 h-3" />;
    return <Sun className="w-3 h-3" />;
  };

  if (!locations.length) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Locations</h3>
        </div>
        <p className="text-zinc-500 text-sm">No locations extracted</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Locations</h3>
            <p className="text-zinc-500 text-sm">{locations.length} unique locations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-zinc-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{interiors.length}</p>
          <p className="text-xs text-zinc-400">Interior</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{exteriors.length}</p>
          <p className="text-xs text-zinc-400">Exterior</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-amber-400">
            <Sun className="w-5 h-5" />
            {dayScenes}
          </div>
          <p className="text-xs text-zinc-400">Day Scenes</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-indigo-400">
            <Moon className="w-5 h-5" />
            {nightScenes}
          </div>
          <p className="text-xs text-zinc-400">Night Scenes</p>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {displayLocations.map((loc, idx) => (
            <motion.div
              key={loc.slugline + idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: idx * 0.03 }}
              className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:border-zinc-600/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-emerald-400 truncate">
                    {loc.slugline}
                  </p>
                  {loc.description && (
                    <p className="text-zinc-500 text-sm mt-1 line-clamp-1">
                      {loc.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={`
                    border text-xs
                    ${loc.int_ext === 'INT' 
                      ? 'border-blue-500/30 text-blue-400' 
                      : 'border-green-500/30 text-green-400'
                    }
                  `}>
                    {loc.int_ext}
                  </Badge>
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded text-xs
                    ${loc.time_of_day?.toUpperCase().includes('NIGHT') 
                      ? 'bg-indigo-500/20 text-indigo-300' 
                      : 'bg-amber-500/20 text-amber-300'
                    }
                  `}>
                    {getTimeIcon(loc.time_of_day)}
                    <span>{loc.time_of_day || 'DAY'}</span>
                  </div>
                  <span className="text-zinc-500 text-xs">
                    {loc.scene_count} scene{loc.scene_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {locations.length > 6 && (
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
              Show All ({locations.length - 6} more)
            </>
          )}
        </button>
      )}
    </div>
  );
}