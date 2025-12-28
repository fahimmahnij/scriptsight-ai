import React from 'react';
import { FileText, Clock, Film, Users, MapPin, Package, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 text-center"
  >
    <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-zinc-500">{label}</p>
  </motion.div>
);

export default function AnalysisSummary({ analysis }) {
  const {
    title,
    total_pages,
    total_scenes,
    characters = [],
    locations = [],
    props = [],
    wardrobe = [],
    vehicles_animals = [],
    vfx_sfx = [],
    challenges = []
  } = analysis;

  const totalElements = props.length + wardrobe.length + vehicles_animals.length + vfx_sfx.length;
  const highChallenges = challenges.filter(c => c.severity === 'high').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-zinc-400 text-sm mt-1">Script Analysis Complete</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
          <span className="text-emerald-400 text-sm font-medium">Analysis Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard 
          icon={FileText} 
          label="Pages" 
          value={total_pages || '—'} 
          color="text-zinc-400"
          delay={0}
        />
        <StatCard 
          icon={Film} 
          label="Scenes" 
          value={total_scenes || '—'} 
          color="text-blue-400"
          delay={0.05}
        />
        <StatCard 
          icon={Users} 
          label="Characters" 
          value={characters.length} 
          color="text-violet-400"
          delay={0.1}
        />
        <StatCard 
          icon={MapPin} 
          label="Locations" 
          value={locations.length} 
          color="text-emerald-400"
          delay={0.15}
        />
        <StatCard 
          icon={Package} 
          label="Elements" 
          value={totalElements} 
          color="text-orange-400"
          delay={0.2}
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Challenges" 
          value={challenges.length} 
          color="text-amber-400"
          delay={0.25}
        />
        <StatCard 
          icon={AlertTriangle} 
          label="High Risk" 
          value={highChallenges} 
          color="text-rose-400"
          delay={0.3}
        />
      </div>
    </motion.div>
  );
}