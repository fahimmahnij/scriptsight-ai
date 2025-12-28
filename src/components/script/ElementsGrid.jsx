import React from 'react';
import { Package, Shirt, Car, Sparkles, Zap, AlertTriangle, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ElementCard = ({ icon: Icon, title, items, color, bgColor, borderColor }) => {
  if (!items?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-900/80 backdrop-blur-sm border ${borderColor} rounded-2xl p-5`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="text-xs text-zinc-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 8).map((item, idx) => {
          const label = item.name || item.description || item.type;
          const category = item.category || item.complexity || item.type;
          
          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    variant="outline" 
                    className={`
                      cursor-default transition-all hover:scale-105
                      ${category === 'weapons_stunts' || category === 'complex' 
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        : category === 'specialty' || category === 'moderate'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          : 'border-zinc-600 bg-zinc-800/50 text-zinc-300'
                      }
                    `}
                  >
                    {label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-zinc-700">
                  <p className="text-sm capitalize">{category?.replace('_', ' ') || 'Standard'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        {items.length > 8 && (
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
            +{items.length - 8} more
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

export default function ElementsGrid({ props = [], wardrobe = [], vehicles_animals = [], vfx_sfx = [] }) {
  const vfx = vfx_sfx.filter(e => e.type === 'vfx');
  const sfx = vfx_sfx.filter(e => e.type === 'sfx');

  const hasElements = props.length || wardrobe.length || vehicles_animals.length || vfx_sfx.length;

  if (!hasElements) {
    return (
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
            <Package className="w-5 h-5 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Production Elements</h3>
        </div>
        <p className="text-zinc-500 text-sm">No production elements extracted</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Clapperboard className="w-5 h-5 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Production Elements</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ElementCard
          icon={Package}
          title="Props"
          items={props}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
          borderColor="border-blue-500/20"
        />
        <ElementCard
          icon={Shirt}
          title="Wardrobe"
          items={wardrobe}
          color="text-pink-400"
          bgColor="bg-pink-500/20"
          borderColor="border-pink-500/20"
        />
        <ElementCard
          icon={Car}
          title="Vehicles & Animals"
          items={vehicles_animals}
          color="text-orange-400"
          bgColor="bg-orange-500/20"
          borderColor="border-orange-500/20"
        />
        <ElementCard
          icon={Sparkles}
          title="VFX / SFX"
          items={vfx_sfx}
          color="text-purple-400"
          bgColor="bg-purple-500/20"
          borderColor="border-purple-500/20"
        />
      </div>
    </div>
  );
}