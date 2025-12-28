import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, Info, Truck, Scale, Calendar, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

const categoryConfig = {
  logistical: {
    icon: Truck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    label: 'Logistical'
  },
  legal: {
    icon: Scale,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    label: 'Legal/Clearance'
  },
  scheduling: {
    icon: Calendar,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    label: 'Scheduling'
  },
  safety: {
    icon: Shield,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    label: 'Safety/Stunts'
  }
};

const severityConfig = {
  low: { color: 'bg-emerald-500', label: 'Low' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  high: { color: 'bg-rose-500', label: 'High' }
};

export default function ChallengesPanel({ challenges = [] }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const groupedChallenges = challenges.reduce((acc, challenge) => {
    const cat = challenge.category || 'logistical';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(challenge);
    return acc;
  }, {});

  const highCount = challenges.filter(c => c.severity === 'high').length;
  const mediumCount = challenges.filter(c => c.severity === 'medium').length;

  if (!challenges.length) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Production Challenges</h3>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Info className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-300 text-sm">No significant challenges flagged</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950/10 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Production Challenges</h3>
            <p className="text-zinc-500 text-sm">{challenges.length} flags identified</p>
          </div>
        </div>
        <div className="flex gap-2">
          {highCount > 0 && (
            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">
              <AlertOctagon className="w-3 h-3 mr-1" />
              {highCount} High
            </Badge>
          )}
          {mediumCount > 0 && (
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              {mediumCount} Medium
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(groupedChallenges).map(([category, items]) => {
          const config = categoryConfig[category] || categoryConfig.logistical;
          const Icon = config.icon;
          const isExpanded = expandedCategory === category;

          return (
            <div key={category} className={`border ${config.borderColor} rounded-xl overflow-hidden`}>
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className={`w-full flex items-center justify-between p-4 ${config.bgColor} hover:bg-opacity-30 transition-all`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <span className="font-medium text-white">{config.label}</span>
                  <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                    {items.length}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 bg-zinc-800/30">
                      {items.map((challenge, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg"
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 ${severityConfig[challenge.severity]?.color || 'bg-zinc-500'}`} />
                          <div className="flex-1">
                            <p className="text-zinc-200 text-sm">{challenge.description}</p>
                            {challenge.scene_reference && (
                              <p className="text-zinc-500 text-xs mt-1">
                                Scene: {challenge.scene_reference}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs shrink-0 ${
                              challenge.severity === 'high' 
                                ? 'border-rose-500/50 text-rose-300' 
                                : challenge.severity === 'medium'
                                  ? 'border-amber-500/50 text-amber-300'
                                  : 'border-zinc-600 text-zinc-400'
                            }`}
                          >
                            {challenge.severity || 'medium'}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}