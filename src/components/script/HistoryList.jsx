import React from 'react';
import { FileText, Clock, ChevronRight, Trash2, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HistoryList({ analyses, onSelect, onDelete, selectedId }) {
  if (!analyses?.length) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 text-center">
        <Film className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Scripts Analyzed</h3>
        <p className="text-zinc-500 text-sm">
          Upload your first screenplay to get started with AI-powered analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          Previous Analyses
        </h3>
      </div>
      <div className="divide-y divide-zinc-800">
        <AnimatePresence>
          {analyses.map((analysis, idx) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                group flex items-center gap-4 p-4 cursor-pointer transition-all
                ${selectedId === analysis.id 
                  ? 'bg-amber-500/10 border-l-2 border-amber-500' 
                  : 'hover:bg-zinc-800/50 border-l-2 border-transparent'
                }
              `}
              onClick={() => onSelect(analysis)}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${selectedId === analysis.id 
                  ? 'bg-amber-500/20' 
                  : 'bg-zinc-800 group-hover:bg-zinc-700'
                }
              `}>
                <FileText className={`w-5 h-5 ${selectedId === analysis.id ? 'text-amber-400' : 'text-zinc-400'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${selectedId === analysis.id ? 'text-amber-200' : 'text-white'}`}>
                  {analysis.title}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {analysis.created_date && format(new Date(analysis.created_date), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {analysis.status === 'completed' && (
                  <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded">
                    Complete
                  </span>
                )}
                {analysis.status === 'analyzing' && (
                  <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded animate-pulse">
                    Processing
                  </span>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Analysis?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        This will permanently delete the analysis for "{analysis.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(analysis.id);
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}