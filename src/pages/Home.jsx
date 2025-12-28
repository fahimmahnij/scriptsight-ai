import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import UploadSection from '../components/script/UploadSection';
import AnalysisProgress from '../components/script/AnalysisProgress';
import PDFViewer from '../components/script/PDFViewer';
import AnalysisPanel from '../components/script/AnalysisPanel';
import HistoryList from '../components/script/HistoryList';

const ScriptAnalysis = base44.entities.ScriptAnalysis;

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [pdfMinimized, setPdfMinimized] = useState(false);
  const [analysisMinimized, setAnalysisMinimized] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
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

      // Run comprehensive AI analysis (process up to 150+ pages)
      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional film script analyst. Analyze this COMPLETE screenplay and extract detailed production data from the ENTIRE script.

IMPORTANT: This is the full script. Make sure to analyze ALL scenes, ALL characters, ALL locations throughout the entire screenplay, not just the beginning.

SCRIPT TEXT:
${scriptText.slice(0, 350000)}

Perform comprehensive analysis of the ENTIRE screenplay:

0. SCENE-BY-SCENE BREAKDOWN:
- Extract EVERY scene with its scene number (1, 2, 3, etc.)
- For each scene provide:
  * scene_number: sequential number (1, 2, 3...)
  * slugline: the full slugline (e.g., "INT. COFFEE SHOP - DAY")
  * location: just the location name
  * int_ext: "INT" or "EXT"
  * time_of_day: "DAY", "NIGHT", "DUSK", etc.
  * page_number: estimated page number in script
  * summary: 1-2 sentence summary of what happens in this scene
  * characters_present: array of character names in this scene

1. ELEMENT BREAKDOWN (scan through ALL scenes):
- Extract ALL CHARACTERS from the entire script (name, estimated age range, gender if indicated, count ALL scenes they appear in, special requirements)
- Identify lead roles (appears in 30%+ of scenes, has significant dialogue throughout)
- Extract ALL PROPS from every scene (categorize as "common", "specialty", or "weapons_stunts")
- Extract ALL notable WARDROBE items with character and period info
- Extract ALL VEHICLES and ANIMALS mentioned anywhere in the script
- Identify ALL VFX and SFX shots throughout (type: "vfx" or "sfx", complexity: "simple", "moderate", or "complex")

2. LOCATION BREAKDOWN (parse ALL sluglines):
- Find EVERY slugline in the script (INT/EXT. LOCATION - TIME)
- For each unique location: int_ext, time_of_day, brief description, total scene count
- Make sure to count all occurrences of each location throughout the script

3. BUDGET ESTIMATE for "indie" tier:
- Based on total cast size, location count, VFX shots, and special requirements
- Provide realistic min and max estimates in USD
- List top 3-5 cost drivers based on entire script

4. GENRE & TONE (analyze complete narrative arc):
- Primary genre and sub-genres based on full story
- Confidence score (0-100)
- Humor scale: "slapstick", "dry", or "none"
- Pacing: "meditative", "medium", or "frenetic"  
- Visual style: "gritty", "naturalistic", or "stylized"
- 2-3 comparable films that match the overall tone

5. PRODUCTION CHALLENGES (scan entire script):
- Find ALL potential challenges throughout the script
- Category: "logistical", "legal", "scheduling", or "safety"
- Description of each challenge
- Severity: "low", "medium", or "high"
- Scene reference if applicable

Also provide:
- total_pages (estimate based on full text length, assume 1 page ≈ 1 minute ≈ 250 words)
- total_scenes (count ALL unique sluglines in the entire script)`,
        response_json_schema: {
          type: "object",
          properties: {
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
  const showSplitView = showResults && !pdfMinimized && !analysisMinimized;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          {/* Header Actions */}
          {!showUpload && (
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleNewAnalysis}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentAnalysis && (
                <h2 className="text-lg font-semibold text-white">{currentAnalysis.title}</h2>
              )}
              <Button
                onClick={handleNewAnalysis}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            {showUpload && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-auto"
              >
                <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
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
                </div>
              </motion.div>
            )}

            {showProgress && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-auto"
              >
                <div className="container mx-auto px-4 py-8">
                  <AnalysisProgress status={currentAnalysis?.status || 'processing'} />
                </div>
              </motion.div>
            )}

            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex overflow-hidden"
              >
                {/* Split View */}
                <PDFViewer
                  fileUrl={currentAnalysis.file_url}
                  isMinimized={pdfMinimized}
                  onToggleMinimize={() => setPdfMinimized(!pdfMinimized)}
                />
                
                <AnalysisPanel
                  analysis={currentAnalysis}
                  isMinimized={analysisMinimized}
                  onToggleMinimize={() => setAnalysisMinimized(!analysisMinimized)}
                  highlightedElement={highlightedElement}
                  onBudgetTierChange={handleBudgetTierChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}