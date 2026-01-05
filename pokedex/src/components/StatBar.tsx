interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

const StatBar = ({ label, value, max = 255 }: StatBarProps) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  
  // Gen 3 logic: Green for high, Blue for mid, Red for low
  const color = pct > 70 
    ? 'var(--pkmn-green)' 
    : pct > 40 
      ? 'var(--pkmn-blue)' 
      : 'var(--pkmn-red)';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-black uppercase">
        <div className="w-24 text-[var(--pkmn-blue)]">{label}</div>
        <div className="tabular-nums">{value}</div>
      </div>
      <div className="h-3 w-full border-2 border-[var(--pkmn-border)] bg-gray-200">
        <div 
          className="h-full transition-all duration-500" 
          style={{ width: `${pct}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
};

export default StatBar;
