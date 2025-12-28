import React from 'react';
import { ListOrdered, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";

export default function ThreeActStructure({ three_act_structure }) {
  if (!three_act_structure) {
    return null;
  }

  const acts = [
    { key: 'act_one', label: 'Act I: Setup', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30' },
    { key: 'act_two', label: 'Act II: Confrontation', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30' },
    { key: 'act_three', label: 'Act III: Resolution', color: 'text-rose-400', bgColor: 'bg-rose-500/20', borderColor: 'border-rose-500/30' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/10 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <ListOrdered className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Three-Act Structure</h3>
          <p className="text-zinc-500 text-sm">Classic screenplay architecture</p>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="mb-8">
        <div className="flex h-8 rounded-lg overflow-hidden">
          {acts.map((act, idx) => {
            const actData = three_act_structure[act.key];
            const percentage = actData?.percentage || (idx === 0 ? 25 : idx === 1 ? 50 : 25);
            
            return (
              <div
                key={act.key}
                className={`${act.bgColor} border-r-2 border-zinc-900 last:border-0 flex items-center justify-center text-xs font-bold ${act.color}`}
                style={{ width: `${percentage}%` }}
              >
                {percentage}%
              </div>
            );
          })}
        </div>
      </div>

      {/* Act Details */}
      <div className="space-y-4">
        {acts.map((act, idx) => {
          const actData = three_act_structure[act.key];
          if (!actData) return null;

          return (
            <motion.div
              key={act.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border ${act.borderColor} ${act.bgColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className={`font-semibold ${act.color}`}>{act.label}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{actData.page_range}</p>
                </div>
                <span className={`text-2xl font-bold ${act.color}`}>
                  {actData.percentage || 0}%
                </span>
              </div>

              {actData.emotional_arc && (
                <p className="text-sm text-zinc-300 mb-3">
                  <span className="text-zinc-500">Emotional Arc:</span> {actData.emotional_arc}
                </p>
              )}

              {actData.turning_points && actData.turning_points.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Key Turning Points:</p>
                  <ul className="space-y-1">
                    {actData.turning_points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-zinc-600">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}