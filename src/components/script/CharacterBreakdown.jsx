import React, { useState } from 'react';
import { Users, Star, ChevronDown, ChevronUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

export default function CharacterBreakdown({ characters = [] }) {
  const [expanded, setExpanded] = useState(false);
  
  const leads = characters.filter(c => c.is_lead);
  const supporting = characters.filter(c => !c.is_lead);
  const displayCharacters = expanded ? characters : characters.slice(0, 6);

  if (!characters.length) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Characters</h3>
        </div>
        <p className="text-zinc-500 text-sm">No characters extracted</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Characters</h3>
            <p className="text-zinc-500 text-sm">{characters.length} speaking roles</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            {leads.length} Lead{leads.length !== 1 ? 's' : ''}
          </Badge>
          <Badge className="bg-zinc-700/50 text-zinc-300 border-zinc-600">
            {supporting.length} Supporting
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {displayCharacters.map((char, idx) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                p-4 rounded-xl border transition-all
                ${char.is_lead 
                  ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20' 
                  : 'bg-zinc-800/50 border-zinc-700/50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${char.is_lead 
                    ? 'bg-amber-500/30 text-amber-300' 
                    : 'bg-zinc-700 text-zinc-300'
                  }
                `}>
                  {char.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate">{char.name}</span>
                    {char.is_lead && <Star className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-zinc-400">
                    {char.age_range && (
                      <span className="px-2 py-0.5 bg-zinc-800 rounded">{char.age_range}</span>
                    )}
                    {char.gender && (
                      <span className="px-2 py-0.5 bg-zinc-800 rounded">{char.gender}</span>
                    )}
                    <span className="px-2 py-0.5 bg-zinc-800 rounded">
                      {char.scene_count} scene{char.scene_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {char.special_requirements?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {char.special_requirements.map((req, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {characters.length > 6 && (
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
              Show All ({characters.length - 6} more)
            </>
          )}
        </button>
      )}
    </div>
  );
}