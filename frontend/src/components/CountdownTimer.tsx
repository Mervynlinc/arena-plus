import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface Props {
  target: number;
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export default function CountdownTimer({ target }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = target - now;
  if (remaining <= 0) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const units = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Mins' },
    { value: seconds, label: 'Secs' },
  ];

  return (
    <View className="items-center gap-2">
      <Text className="font-inter font-medium text-[11px] text-textSecondary uppercase tracking-widest">
        Starts in
      </Text>
      <View className="flex-row items-center gap-[6px]">
        {units.map((unit, i) => (
          <View key={unit.label} className="flex-row items-center gap-[6px]">
            {i > 0 && (
              <Text className="font-inter font-bold text-lg text-textMuted">:</Text>
            )}
            <View className="w-12 py-[8px] rounded-xl bg-bgCard2 border border-stroke items-center gap-[2px]">
              <Text className="font-inter font-bold text-lg text-accent">
                {pad(unit.value)}
              </Text>
              <Text className="font-inter font-medium text-[9px] text-textSecondary uppercase">
                {unit.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
