import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

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
      style={{
        padding: 14,
        paddingLeft: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.bgCard2,
        borderRadius: 16,
        width: 342,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#242429',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: colors.accent }}>▶</Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 14, color: colors.text }}>
            {serverName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 3,
                backgroundColor: colors.greenBadge,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 9, color: colors.bg }}>
                {quality}
              </Text>
            </View>
            <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 11, color: colors.textSecondary }}>
              {language} · {tag}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 18,
          backgroundColor: colors.accent,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontFamily: 'Inter', fontWeight: '700', fontSize: 13, color: colors.bg }}>
          Watch
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
