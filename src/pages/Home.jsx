import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import UploadSection from '../components/script/UploadSection';
import AnalysisProgress from '../components/script/AnalysisProgress';
import AnalysisPanel from '../components/script/AnalysisPanel';
import HistoryList from '../components/script/HistoryList';

const ScriptAnalysis = base44.entities.ScriptAnalysis;

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const queryClient = useQueryClient();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: () => ScriptAnalysis.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => ScriptAnalysis.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      setCurrentAnalysis(data);
      runAnalysis(data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ScriptAnalysis.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      setCurrentAnalysis(data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ScriptAnalysis.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      if (currentAnalysis?.id) {
        setCurrentAnalysis(null);
        setShowUpload(true);
      }
      toast.success('Analysis deleted');
    },
  });

  const runAnalysis = async (analysis) => {
    setIsProcessing(true);
    setShowUpload(false);

    try {
      // Update status to processing
      await updateMutation.mutateAsync({
        id: analysis.id,
        data: { status: 'processing' }
      });

      // Extract text from file
      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: analysis.file_url,
        json_schema: {
          type: "object",
          properties: {
            full_text: { type: "string", description: "The complete script text" }
          }
        }
      });

      const scriptText = extractResult.output?.full_text || '';

      // Update status to analyzing
      await updateMutation.mutateAsync({
        id: analysis.id,
        data: { status: 'analyzing', raw_text: scriptText.slice(0, 200000) }
      });

      // Run comprehensive AI analysis
      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert Hollywood script analyst. Analyze this complete screenplay comprehensively.

SCRIPT TEXT:
${scriptText.slice(0, 350000)}

Provide a complete analysis covering:

1. LOGLINE & SYNOPSIS
- Logline: One compelling sentence in format "[Protagonist] must [Goal] or else [Consequence]"
- Synopsis: 150-word story summary with key plot points

2. HERO'S JOURNEY (12 stages)
Map each of these stages with page range, scene description, and purpose:
Ordinary World, Call to Adventure, Refusal of the Call, Meeting the Mentor, Crossing the Threshold, Tests/Allies/Enemies, Approach to Inmost Cave, Ordeal, Reward, The Road Back, Resurrection, Return with the Elixir

3. THREE-ACT STRUCTURE
Divide script into 3 acts with page ranges, percentages, emotional arcs, and turning points

4. EIGHT SEQUENCES
Break into 8 sequences (A-H), each with title, page range, key scenes, and narrative function

5. SCENES
Extract all scenes with: scene number, slugline, location, INT/EXT, time of day, page number, brief summary, characters present

6. PRODUCTION ELEMENTS
- Characters: name, age range, gender, scene count, special requirements, is_lead status
- Props: name, category (common/specialty/weapons_stunts)
- Wardrobe: description, character, period
- Vehicles/Animals: type, description
- VFX/SFX: type (vfx/sfx), description, complexity (simple/moderate/complex)

7. LOCATIONS
All unique locations with INT/EXT, time of day, description, scene count

8. BUDGET ESTIMATE
Min/max USD estimates for indie tier, top 3-5 cost drivers

9. GENRE & TONE
Primary genre, sub-genres, confidence (0-100), humor scale (slapstick/dry/none), pacing (meditative/medium/frenetic), visual style (gritty/naturalistic/stylized), comparable films

10. PRODUCTION CHALLENGES
Category (logistical/legal/scheduling/safety), description, severity (low/medium/high), scene reference

Include total_pages and total_scenes count.`,
        response_json_schema: {
          type: "object",
          properties: {
            logline: { type: "string" },
            synopsis: { type: "string" },
            heros_journey: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  stage: { type: "string" },
                  page_range: { type: "string" },
                  scene_reference: { type: "string" },
                  narrative_purpose: { type: "string" }
                }
              }
            },
            three_act_structure: {
              type: "object",
              properties: {
                act_one: {
                  type: "object",
                  properties: {
                    page_range: { type: "string" },
                    percentage: { type: "number" },
                    emotional_arc: { type: "string" },
                    turning_points: { type: "array", items: { type: "string" } }
                  }
                },
                act_two: {
                  type: "object",
                  properties: {
                    page_range: { type: "string" },
                    percentage: { type: "number" },
                    emotional_arc: { type: "string" },
                    turning_points: { type: "array", items: { type: "string" } }
                  }
                },
                act_three: {
                  type: "object",
                  properties: {
                    page_range: { type: "string" },
                    percentage: { type: "number" },
                    emotional_arc: { type: "string" },
                    turning_points: { type: "array", items: { type: "string" } }
                  }
                }
              }
            },
            eight_sequences: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sequence_letter: { type: "string" },
                  title: { type: "string" },
                  page_range: { type: "string" },
                  key_scenes: { type: "array", items: { type: "string" } },
                  narrative_function: { type: "string" }
                }
              }
            },
            total_pages: { type: "number" },
            total_scenes: { type: "number" },
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scene_number: { type: "number" },
                  slugline: { type: "string" },
                  location: { type: "string" },
                  int_ext: { type: "string" },
                  time_of_day: { type: "string" },
                  page_number: { type: "number" },
                  summary: { type: "string" },
                  characters_present: { type: "array", items: { type: "string" } }
                }
              }
            },
            characters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  age_range: { type: "string" },
                  gender: { type: "string" },
                  scene_count: { type: "number" },
                  special_requirements: { type: "array", items: { type: "string" } },
                  is_lead: { type: "boolean" }
                }
              }
            },
            props: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string" }
                }
              }
            },
            wardrobe: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  character: { type: "string" },
                  period: { type: "string" }
                }
              }
            },
            vehicles_animals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            vfx_sfx: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                  complexity: { type: "string" }
                }
              }
            },
            locations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  slugline: { type: "string" },
                  int_ext: { type: "string" },
                  time_of_day: { type: "string" },
                  description: { type: "string" },
                  scene_count: { type: "number" }
                }
              }
            },
            budget_estimate: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" },
                top_cost_drivers: { type: "array", items: { type: "string" } }
              }
            },
            genre_analysis: {
              type: "object",
              properties: {
                primary_genre: { type: "string" },
                sub_genres: { type: "array", items: { type: "string" } },
                confidence: { type: "number" },
                humor_scale: { type: "string" },
                pacing_scale: { type: "string" },
                visual_style: { type: "string" },
                comparable_films: { type: "array", items: { type: "string" } }
              }
            },
            challenges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  description: { type: "string" },
                  severity: { type: "string" },
                  scene_reference: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Update with final results
      await updateMutation.mutateAsync({
        id: analysis.id,
        data: {
          status: 'completed',
          ...analysisResult
        }
      });

      toast.success('Script analysis complete!');
    } catch (error) {
      console.error('Analysis failed:', error);
      await updateMutation.mutateAsync({
        id: analysis.id,
        data: { status: 'failed' }
      });
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalysisStart = async ({ file_url, title }) => {
    createMutation.mutate({
      title,
      file_url,
      status: 'uploading',
      budget_tier: 'indie'
    });
  };

  const handleSelectAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
    setShowUpload(false);
    if (analysis.status === 'analyzing' || analysis.status === 'processing') {
      setIsProcessing(true);
    } else {
      setIsProcessing(false);
    }
  };

  const handleBudgetTierChange = (tier) => {
    if (!currentAnalysis) return;
    
    // Recalculate budget based on tier
    const multipliers = {
      micro: { min: 0.1, max: 0.3 },
      indie: { min: 1, max: 1 },
      studio: { min: 10, max: 20 }
    };
    
    const baseBudget = currentAnalysis.budget_estimate || { min: 500000, max: 2000000 };
    const mult = multipliers[tier];
    
    updateMutation.mutate({
      id: currentAnalysis.id,
      data: {
        budget_tier: tier,
        budget_estimate: {
          ...baseBudget,
          min: Math.round(baseBudget.min * mult.min),
          max: Math.round(baseBudget.max * mult.max)
        }
      }
    });
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setShowUpload(true);
    setIsProcessing(false);
  };

  const showResults = currentAnalysis?.status === 'completed';
  const showProgress = currentAnalysis && !showResults && (isProcessing || currentAnalysis.status !== 'completed');

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Actions */}
        {!showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Button
              variant="ghost"
              onClick={handleNewAnalysis}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNewAnalysis}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {showUpload && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-center py-12">
                <UploadSection 
                  onAnalysisStart={handleAnalysisStart} 
                  isProcessing={createMutation.isPending}
                />
              </div>
              
              <div className="max-w-2xl mx-auto">
                <HistoryList
                  analyses={analyses}
                  onSelect={handleSelectAnalysis}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  selectedId={currentAnalysis?.id}
                />
              </div>
            </motion.div>
          )}

          {showProgress && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisProgress status={currentAnalysis?.status || 'processing'} />
            </motion.div>
          )}

          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisPanel
                analysis={currentAnalysis}
                onBudgetTierChange={handleBudgetTierChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}