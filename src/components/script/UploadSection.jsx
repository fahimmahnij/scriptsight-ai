import React, { useState, useCallback } from 'react';
import { Upload, FileText, Film, Loader2, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadSection({ onAnalysisStart, isProcessing }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      // Extract title from filename
      const fileName = droppedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onAnalysisStart({ file_url, title: title.trim() });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  const isLoading = uploading || isProcessing;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <Film className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-300 font-medium">AI Script Analyst</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Script <span className="text-amber-400">Breakdown</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">
          Upload your screenplay for instant AI-powered analysis, budget estimation, and production insights.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300
          ${dragActive 
            ? 'border-amber-400 bg-amber-500/10' 
            : file 
              ? 'border-emerald-500/50 bg-emerald-500/5' 
              : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.fdx,.fountain,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isLoading}
        />
        
        <div className="p-12 text-center">
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-zinc-500 text-sm mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Drop your screenplay here</p>
                  <p className="text-zinc-500 text-sm mt-1">
                    Supports .pdf, .fdx, .fountain, or .txt
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Script Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter script title..."
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20"
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold rounded-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {uploading ? 'Uploading...' : 'Analyzing Script...'}
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Analyze Script
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}