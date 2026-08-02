import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  serverName: string;
  quality: string;
  language: string;
  tag: string;
  onPress: () => void;
}

export default function StreamRow({ serverName, quality, language, tag, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="p-[14px] pl-4 flex-row justify-between items-center bg-bgCard2 rounded-2xl w-full"
    >
      <View className="flex-1 min-w-0 flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-xl justify-center items-center" style={{ backgroundColor: '#242429' }}>
          <Text className="text-lg text-accent">▶</Text>
        </View>
        <View className="flex-1 min-w-0 gap-[5px]">
          <Text className="font-inter font-semibold text-sm text-text" numberOfLines={1} ellipsizeMode="tail">
            {serverName}
          </Text>
          <View className="flex-row items-center gap-[6px]">
            <View className="px-[6px] py-[3px] bg-greenBadge rounded-[5px]">
              <Text className="font-inter font-bold text-[9px] text-bg">
                {quality}
              </Text>
            </View>
            <Text className="flex-1 font-inter font-medium text-[11px] text-textSecondary" numberOfLines={1} ellipsizeMode="tail">
              {language} · {tag}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="py-[10px] px-[18px] bg-accent rounded-xl"
      >
        <Text className="font-inter font-bold text-[13px] text-bg">
          Watch
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
