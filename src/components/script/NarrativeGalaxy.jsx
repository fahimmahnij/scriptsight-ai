import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Layers, Compass, Grid3x3, Film, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NarrativeGalaxy({ 
  three_act_structure, 
  eight_sequences = [], 
  heros_journey = [],
  scenes = [] 
}) {
  const [view, setView] = useState('universe'); // universe, sequences, journey, scenes
  const [selectedAct, setSelectedAct] = useState(null);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const hasData = three_act_structure || eight_sequences.length > 0 || heros_journey.length > 0;

  if (!hasData) {
    return null;
  }

  const handleActClick = (actKey) => {
    setSelectedAct(actKey);
    setView('sequences');
  };

  const handleSequenceClick = (seq) => {
    setSelectedSequence(seq);
    setView('journey');
  };

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
    setView('scenes');
  };

  const handleBack = () => {
    if (view === 'scenes') {
      setView('journey');
      setSelectedStage(null);
    } else if (view === 'journey') {
      setView('sequences');
      setSelectedSequence(null);
    } else if (view === 'sequences') {
      setView('universe');
      setSelectedAct(null);
    }
  };

  const handleReset = () => {
    setView('universe');
    setSelectedAct(null);
    setSelectedSequence(null);
    setSelectedStage(null);
  };

  // Universe View - Acts
  const UniverseView = () => {
    const acts = [
      { key: 'act_one', label: 'Act I', subtitle: 'Setup', color: 'from-emerald-500 to-teal-600', data: three_act_structure?.act_one },
      { key: 'act_two', label: 'Act II', subtitle: 'Confrontation', color: 'from-amber-500 to-orange-600', data: three_act_structure?.act_two },
      { key: 'act_three', label: 'Act III', subtitle: 'Resolution', color: 'from-rose-500 to-pink-600', data: three_act_structure?.act_three }
    ];

    return (
      <div className="relative min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {acts.map((act, idx) => (
            <motion.div
              key={act.key}
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => handleActClick(act.key)}
              className="cursor-pointer group"
            >
              <div className={`relative h-64 rounded-3xl bg-gradient-to-br ${act.color} p-[2px] overflow-hidden`}>
                <div className="absolute inset-0 bg-zinc-950 opacity-90 group-hover:opacity-80 transition-opacity rounded-3xl" />
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 opacity-20"
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${act.color} blur-3xl`} />
                  </motion.div>
                  
                  <div className="relative z-10">
                    <Layers className="w-12 h-12 mx-auto mb-4 text-white" />
                    <h3 className="text-3xl font-bold text-white mb-2">{act.label}</h3>
                    <p className="text-zinc-300 text-sm mb-3">{act.subtitle}</p>
                    {act.data && (
                      <>
                        <Badge variant="outline" className="border-white/20 text-white mb-2">
                          {act.data.page_range}
                        </Badge>
                        <p className="text-2xl font-bold text-white">{act.data.percentage}%</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Sequences View
  const SequencesView = () => {
    const filteredSequences = eight_sequences.filter(seq => {
      const seqIndex = seq.sequence_letter?.charCodeAt(0) - 65;
      if (selectedAct === 'act_one') return seqIndex <= 1;
      if (selectedAct === 'act_two') return seqIndex >= 2 && seqIndex <= 5;
      if (selectedAct === 'act_three') return seqIndex >= 6;
      return true;
    });

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredSequences.map((seq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSequenceClick(seq)}
            className="cursor-pointer"
          >
            <div className="relative h-48 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400 transition-all p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Grid3x3 className="w-4 h-4 text-purple-400" />
                <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                  {seq.sequence_letter}
                </Badge>
              </div>
              <h4 className="text-white font-semibold text-sm mb-2 flex-1">{seq.title}</h4>
              <p className="text-xs text-zinc-400">{seq.page_range}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Journey View
  const JourneyView = () => (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500" />
      
      <div className="space-y-6">
        {heros_journey.map((stage, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 10 }}
            onClick={() => handleStageClick(stage)}
            className="relative pl-16 cursor-pointer group"
          >
            <div className="absolute left-5 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-4 border-zinc-950 group-hover:scale-125 transition-transform" />
            
            <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 group-hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <Badge variant="outline" className="border-cyan-400/50 text-cyan-300">
                  Stage {idx + 1}
                </Badge>
              </div>
              <h4 className="text-white font-semibold mb-1">{stage.stage}</h4>
              <p className="text-sm text-zinc-400 mb-2">{stage.page_range}</p>
              <p className="text-sm text-zinc-300">{stage.scene_reference}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Scenes View
  const ScenesView = () => {
    const stagePages = selectedStage?.page_range?.match(/\d+/g) || [];
    const startPage = parseInt(stagePages[0]) || 0;
    const endPage = parseInt(stagePages[1]) || 999;
    
    const filteredScenes = scenes.filter(scene => 
      scene.page_number >= startPage && scene.page_number <= endPage
    );

    return (
      <div className="space-y-3">
        {filteredScenes.length > 0 ? (
          filteredScenes.map((scene, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-4 h-4 text-amber-400" />
                <Badge variant="outline" className="border-amber-400/50 text-amber-300">
                  Scene {scene.scene_number}
                </Badge>
                <span className="text-xs text-zinc-500">Page {scene.page_number}</span>
              </div>
              <p className="text-white font-medium mb-1">{scene.slugline}</p>
              <p className="text-sm text-zinc-400">{scene.summary}</p>
              {scene.characters_present?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {scene.characters_present.map((char, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">
                      {char}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-center text-zinc-500 py-8">No scenes found for this stage</p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {view !== 'universe' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">
              {view === 'universe' && 'Narrative Universe'}
              {view === 'sequences' && `Sequences - ${selectedAct?.replace('_', ' ').toUpperCase()}`}
              {view === 'journey' && "Hero's Journey"}
              {view === 'scenes' && `Scenes - ${selectedStage?.stage}`}
            </h3>
            <p className="text-xs text-zinc-500">
              {view === 'universe' && 'Explore the three-act structure'}
              {view === 'sequences' && 'Drill into eight sequences'}
              {view === 'journey' && "Navigate the hero's path"}
              {view === 'scenes' && 'Scene-by-scene breakdown'}
            </p>
          </div>
        </div>
        {view !== 'universe' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'universe' && <UniverseView />}
          {view === 'sequences' && <SequencesView />}
          {view === 'journey' && <JourneyView />}
          {view === 'scenes' && <ScenesView />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}