import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

import AnalysisSummary from './AnalysisSummary';
import LoglineSynopsis from './LoglineSynopsis';
import HerosJourney from './HerosJourney';
import ThreeActStructure from './ThreeActStructure';
import EightSequences from './EightSequences';
import SceneBreakdown from './SceneBreakdown';
import CharacterBreakdown from './CharacterBreakdown';
import LocationBreakdown from './LocationBreakdown';
import ElementsGrid from './ElementsGrid';
import BudgetEstimate from './BudgetEstimate';
import GenreAnalysis from './GenreAnalysis';
import ChallengesPanel from './ChallengesPanel';
import ExportJSON from './ExportJSON';

export default function AnalysisPanel({ 
  analysis, 
  isMinimized, 
  onToggleMinimize, 
  highlightedElement,
  onBudgetTierChange 
}) {
  if (isMinimized) {
    return (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '60px', opacity: 1 }}
        className="bg-zinc-950 border-l border-zinc-800 flex flex-col items-center py-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMinimize}
          className="text-zinc-400 hover:text-white"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
        <div className="mt-4 -rotate-90 whitespace-nowrap text-xs text-zinc-500 font-medium">
          Analysis
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '50%', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="bg-zinc-950 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h3 className="font-semibold text-white">Analysis</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMinimize}
          className="text-zinc-400 hover:text-white h-8 w-8"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-6 space-y-8">
        <AnalysisSummary analysis={analysis} />
        
        <LoglineSynopsis logline={analysis.logline} synopsis={analysis.synopsis} />
        
        <div className="grid grid-cols-1 gap-8">
          <HerosJourney heros_journey={analysis.heros_journey} />
          <ThreeActStructure three_act_structure={analysis.three_act_structure} />
          <EightSequences eight_sequences={analysis.eight_sequences} />
        </div>
        
        <SceneBreakdown scenes={analysis.scenes} highlightedScene={highlightedElement?.scene} />
        
        <div className="grid grid-cols-1 gap-8">
          <CharacterBreakdown 
            characters={analysis.characters} 
            highlightedCharacter={highlightedElement?.character}
          />
          <LocationBreakdown 
            locations={analysis.locations}
            highlightedLocation={highlightedElement?.location}
          />
        </div>

        <ElementsGrid
          props={analysis.props}
          wardrobe={analysis.wardrobe}
          vehicles_animals={analysis.vehicles_animals}
          vfx_sfx={analysis.vfx_sfx}
        />

        <div className="grid grid-cols-1 gap-8">
          <BudgetEstimate
            budget_estimate={analysis.budget_estimate}
            budget_tier={analysis.budget_tier}
            onTierChange={onBudgetTierChange}
          />
          <GenreAnalysis genre_analysis={analysis.genre_analysis} />
        </div>

        <ChallengesPanel challenges={analysis.challenges} />
        <ExportJSON analysis={analysis} />
      </div>
    </motion.div>
  );
}