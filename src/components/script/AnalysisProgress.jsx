import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scan, Brain, DollarSign, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const steps = [
  { id: 'uploading', label: 'Uploading Script', icon: FileText },
  { id: 'processing', label: 'Extracting Text', icon: Scan },
  { id: 'analyzing', label: 'AI Analysis', icon: Brain },
  { id: 'completed', label: 'Complete', icon: CheckCircle },
];

const getStepIndex = (status) => {
  const idx = steps.findIndex(s => s.id === status);
  return idx === -1 ? 0 : idx;
};

export default function AnalysisProgress({ status }) {
  const currentIndex = getStepIndex(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto py-16"
    >
      <div className="text-center mb-12">
        <motion.div
          animate={{ rotate: status !== 'completed' ? 360 : 0 }}
          transition={{ duration: 2, repeat: status !== 'completed' ? Infinity : 0, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-[2px]"
        >
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
            {status === 'completed' ? (
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            ) : (
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            )}
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {status === 'completed' ? 'Analysis Complete' : 'Analyzing Your Script'}
        </h2>
        <p className="text-zinc-400">
          {status === 'uploading' && 'Uploading your screenplay...'}
          {status === 'processing' && 'Extracting and parsing script content...'}
          {status === 'analyzing' && 'AI is analyzing elements, budget, genre, and challenges...'}
          {status === 'completed' && 'Your script breakdown is ready!'}
        </p>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-8 right-8 h-0.5 bg-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-black' 
                    : isCurrent 
                      ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400' 
                      : 'bg-zinc-800 border-2 border-zinc-700 text-zinc-500'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`
                  mt-3 text-xs font-medium text-center
                  ${isCompleted || isCurrent ? 'text-zinc-300' : 'text-zinc-600'}
                `}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}