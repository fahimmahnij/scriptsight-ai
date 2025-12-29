import React from 'react';
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

export default function AnalysisPanel({ analysis, onBudgetTierChange }) {
  return (
    <div className="space-y-8">
      <AnalysisSummary analysis={analysis} />
      
      <LoglineSynopsis logline={analysis.logline} synopsis={analysis.synopsis} />
      
      <div className="grid grid-cols-1 gap-8">
        <HerosJourney heros_journey={analysis.heros_journey} />
        <ThreeActStructure three_act_structure={analysis.three_act_structure} />
        <EightSequences eight_sequences={analysis.eight_sequences} />
      </div>
      
      <SceneBreakdown scenes={analysis.scenes} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CharacterBreakdown characters={analysis.characters} />
        <LocationBreakdown locations={analysis.locations} />
      </div>

      <ElementsGrid
        props={analysis.props}
        wardrobe={analysis.wardrobe}
        vehicles_animals={analysis.vehicles_animals}
        vfx_sfx={analysis.vfx_sfx}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
  );
}