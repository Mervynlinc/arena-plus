import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import StreamRow from '@/components/StreamRow';
import { fetchStreams, posterUrl, badgeUrl, Stream, Match } from '@/lib/api';

export default function MatchDetailScreen() {
  const { match: matchJson } = useLocalSearchParams<{ id: string; match?: string }>();
  const match: Match | null = matchJson ? JSON.parse(matchJson) : null;
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  const imageUri = posterUrl(match?.poster);

  useEffect(() => {
    if (!match?.sources?.length) {
      setLoading(false);
      return;
    }
    Promise.all(
      match.sources.map((s) => fetchStreams(s.source, s.id))
    )
      .then((results) => setStreams(results.flat()))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [match]);

  const handleWatch = async (stream: Stream) => {
    router.push({ pathname: '/player', params: { url: stream.embedUrl, title: match?.title } });
  };

  const formatSourceName = (source: string) => {
    return `Server ${source.charAt(0).toUpperCase() + source.slice(1)}`;
  };

  return (
    <View className="flex-1 bg-bg">
      <View className="relative">
        {imageUri && (
          <>
            <Image
              source={{ uri: imageUri }}
              className="absolute inset-0"
              style={{ width: '100%', height: 340 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(10,10,12,0.35)', 'rgba(10,10,12,0.97)']}
              locations={[0.15, 1]}
              className="absolute inset-0"
              style={{ height: 340 }}
            />
          </>
        )}
        <View className="pt-[60px] px-6 pb-5" style={imageUri ? undefined : {}}>
          <View className="flex-row items-center gap-4 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-bgCard2 justify-center items-center"
            >
              <ArrowLeft size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {match?.teams ? (
            <View className="items-center gap-4">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-liveRed" />
                <Text className="font-inter font-semibold text-xs text-liveRed tracking-wide uppercase">
                  {match.category}
                </Text>
              </View>
              <View className="flex-row items-center gap-6">
                <View className="items-center gap-3">
                  {badgeUrl(match.teams.home?.badge) ? (
                    <Image source={{ uri: badgeUrl(match.teams.home?.badge) }} className="w-20 h-20 rounded-full" resizeMode="contain" />
                  ) : (
                    <View className="w-20 h-20 rounded-full bg-bgCard2 border border-stroke" />
                  )}
                  <Text className="font-inter font-bold text-base text-text w-28 text-center" numberOfLines={2}>
                    {match.teams.home?.name}
                  </Text>
                </View>
                <View className="items-center gap-2">
                  <View className="py-[4px] px-[10px] bg-liveRed rounded-full">
                    <Text className="font-inter font-bold text-[10px] text-text tracking-wide">
                      ● LIVE
                    </Text>
                  </View>
                  <Text className="font-inter font-extrabold text-[32px] text-text">
                    VS
                  </Text>
                </View>
                <View className="items-center gap-3">
                  {badgeUrl(match.teams.away?.badge) ? (
                    <Image source={{ uri: badgeUrl(match.teams.away?.badge) }} className="w-20 h-20 rounded-full" resizeMode="contain" />
                  ) : (
                    <View className="w-20 h-20 rounded-full bg-bgCard2 border border-stroke" />
                  )}
                  <Text className="font-inter font-bold text-base text-text w-28 text-center" numberOfLines={2}>
                    {match.teams.away?.name}
                  </Text>
                </View>
              </View>
              <Text className="font-inter font-medium text-sm text-textMuted">
                {match.title}
              </Text>
            </View>
          ) : (
            <View className="items-center gap-4 px-4">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-liveRed" />
                <Text className="font-inter font-semibold text-xs text-liveRed tracking-wide uppercase">
                  {match?.category}
                </Text>
              </View>
              <Text className="font-inter font-bold text-2xl text-text text-center" numberOfLines={3}>
                {match?.title}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View className="flex-1 bg-bgCard rounded-t-[28px] pt-6 px-6">
        <View className="flex-row items-center justify-between mb-5">
          <Text className="font-inter font-bold text-[17px] text-text">
            Available Streams
          </Text>
          {streams.length > 0 && (
            <Text className="font-inter font-medium text-xs text-textSecondary">
              {streams.length} source{streams.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {loading ? (
          <View className="items-center pt-10">
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        ) : streams.length === 0 ? (
          <View className="items-center pt-16">
            <Text className="font-inter font-semibold text-[15px] text-text mb-2">No streams available</Text>
            <Text className="font-inter font-normal text-sm text-textSecondary text-center leading-5">
              Stream sources may appear closer{'\n'}to match start time
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-[14px] pb-20">
              {streams.map((stream) => (
                <StreamRow
                  key={`${stream.source}-${stream.streamNo}`}
                  serverName={formatSourceName(stream.source)}
                  quality={stream.hd ? 'HD' : 'SD'}
                  language={stream.language ?? 'EN'}
                  tag={stream.viewers ? `${stream.viewers} watching` : 'Available'}
                  onPress={() => handleWatch(stream)}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
