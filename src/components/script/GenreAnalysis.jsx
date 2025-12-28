import React from 'react';
import { Film, Target, Gauge, Palette, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ScaleIndicator = ({ label, value, leftLabel, rightLabel, color }) => {
  const scaleValues = {
    'slapstick': 0, 'dry': 50, 'none': 100,
    'meditative': 0, 'medium': 50, 'frenetic': 100,
    'gritty': 0, 'naturalistic': 50, 'stylized': 100, 'saturated': 100
  };

  const position = scaleValues[value?.toLowerCase()] ?? 50;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className={`text-sm font-medium ${color}`}>{value}</span>
      </div>
      <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`absolute h-full rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${position}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg transition-all duration-500"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default function GenreAnalysis({ genre_analysis = {} }) {
  const {
    primary_genre,
    sub_genres = [],
    confidence,
    humor_scale,
    pacing_scale,
    visual_style,
    comparable_films = []
  } = genre_analysis;

  if (!primary_genre) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Film className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Genre & Tone</h3>
        </div>
        <p className="text-zinc-500 text-sm">No genre analysis available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/10 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Film className="w-5 h-5 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Genre & Tone Analysis</h3>
      </div>

      {/* Primary Genre */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-white">{primary_genre}</h4>
            {sub_genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {sub_genres.map((genre, idx) => (
                  <Badge key={idx} variant="outline" className="border-zinc-600 text-zinc-300">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {confidence != null && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{confidence}%</span>
              </div>
              <p className="text-xs text-zinc-500">Confidence</p>
            </div>
          )}
        </div>
      </div>

      {/* Tone Scales */}
      <div className="space-y-6 mb-8">
        {humor_scale && (
          <ScaleIndicator
            label="Humor"
            value={humor_scale}
            leftLabel="Slapstick"
            rightLabel="None"
            color="text-yellow-400"
          />
        )}
        {pacing_scale && (
          <ScaleIndicator
            label="Pacing"
            value={pacing_scale}
            leftLabel="Meditative"
            rightLabel="Frenetic"
            color="text-blue-400"
          />
        )}
        {visual_style && (
          <ScaleIndicator
            label="Visual Style"
            value={visual_style}
            leftLabel="Gritty"
            rightLabel="Stylized"
            color="text-purple-400"
          />
        )}
      </div>

      {/* Comparable Films */}
      {comparable_films.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clapperboard className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-zinc-300">Comparable Films</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {comparable_films.map((film, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl"
              >
                <span className="text-amber-200 text-sm">{film}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}