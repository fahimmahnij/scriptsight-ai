import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatCurrency = (num) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

export default function BudgetEstimate({ budget_estimate, budget_tier = 'indie', onTierChange }) {
  const { min, max, top_cost_drivers = [] } = budget_estimate || {};

  const tierInfo = {
    micro: { label: 'Micro-Budget', range: '$50K - $500K', color: 'text-emerald-400' },
    indie: { label: 'Independent', range: '$500K - $5M', color: 'text-blue-400' },
    studio: { label: 'Studio', range: '$5M - $100M+', color: 'text-purple-400' },
  };

  if (!min && !max) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Budget Estimate</h3>
        </div>
        <p className="text-zinc-500 text-sm">No budget estimate available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Budget Estimate</h3>
        </div>
        
        <Select value={budget_tier} onValueChange={onTierChange}>
          <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="micro" className="text-white hover:bg-zinc-700">
              Micro-Budget
            </SelectItem>
            <SelectItem value="indie" className="text-white hover:bg-zinc-700">
              Independent
            </SelectItem>
            <SelectItem value="studio" className="text-white hover:bg-zinc-700">
              Studio
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-white">
            {formatCurrency(min)}
          </span>
          <span className="text-2xl text-zinc-500">—</span>
          <span className="text-4xl font-bold text-white">
            {formatCurrency(max)}
          </span>
        </div>
        <p className={`text-sm mt-2 ${tierInfo[budget_tier]?.color}`}>
          {tierInfo[budget_tier]?.label} Production
        </p>
      </div>

      {top_cost_drivers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-zinc-300">Top Cost Drivers</span>
          </div>
          <div className="space-y-2">
            {top_cost_drivers.map((driver, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl"
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${idx === 0 ? 'bg-amber-500/30 text-amber-300' : 'bg-zinc-700 text-zinc-400'}
                `}>
                  {idx + 1}
                </div>
                <span className="text-zinc-200 text-sm">{driver}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm font-medium">Preliminary Estimate</p>
            <p className="text-amber-300/60 text-xs mt-1">
              This is an AI-generated estimate based on script elements. Actual costs may vary significantly based on production choices, locations, and market conditions.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}