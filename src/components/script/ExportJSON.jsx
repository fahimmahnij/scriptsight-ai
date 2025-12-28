import React from 'react';
import { Download, FileJson, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from 'framer-motion';

export default function ExportJSON({ analysis }) {
  const [copied, setCopied] = React.useState(false);

  const exportData = {
    title: analysis.title,
    metadata: {
      total_pages: analysis.total_pages,
      total_scenes: analysis.total_scenes,
      analysis_date: new Date().toISOString()
    },
    element_breakdown: {
      characters: analysis.characters,
      locations: analysis.locations,
      props: analysis.props,
      wardrobe: analysis.wardrobe,
      vehicles_animals: analysis.vehicles_animals,
      vfx_sfx: analysis.vfx_sfx
    },
    budget_estimation: {
      tier: analysis.budget_tier,
      estimate: analysis.budget_estimate
    },
    genre_analysis: analysis.genre_analysis,
    production_challenges: analysis.challenges
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.title?.replace(/\s+/g, '_') || 'script'}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JSON exported successfully');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <FileJson className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Export Data</h3>
          <p className="text-zinc-500 text-sm">Download or copy structured JSON</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl overflow-hidden">
        <pre className="text-xs text-zinc-400 overflow-x-auto max-h-40">
          {JSON.stringify(exportData, null, 2).slice(0, 500)}...
        </pre>
      </div>
    </motion.div>
  );
}