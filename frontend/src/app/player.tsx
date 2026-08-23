import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import GeckoView from '@kauza/react-native-geckoview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const LOADING_TIMEOUT = 30000;

const INJECT_JS = `
(function(){
  function autoplay(){
    document.querySelectorAll('video').forEach(function(v){
      v.muted=true;v.autoplay=true;v.setAttribute('playsinline','');
      v.play().catch(function(){});
    });
  }
  autoplay();
  new MutationObserver(autoplay).observe(document.documentElement,{childList:true,subtree:true});
})();
`;

const STOP_JS = `
(function(){
  try {
    document.querySelectorAll('video,audio').forEach(function(el){
      try { el.pause(); } catch(e){}
      el.removeAttribute('src');
      el.load();
    });
  } catch(e){}
  try { window.stop(); } catch(e){}
  try { window.location.href = 'about:blank'; } catch(e){}
})();
`;

export default function PlayerScreen() {
  const { url } = useLocalSearchParams<{ url: string; title?: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geckoRef = useRef<any>(null);
  const navigation = useNavigation();
  const removingRef = useRef(false);

  const streamUrl = url || '';

  const stopMedia = useCallback(() => {
    try {
      geckoRef.current?.stopLoading();
    } catch {}
    try {
      geckoRef.current?.injectJavaScript(STOP_JS);
    } catch {}
    try {
      geckoRef.current?.loadUrl('about:blank');
    } catch {}
  }, []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      stopMedia();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [stopMedia]);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (!geckoRef.current || removingRef.current) return;
      removingRef.current = true;
      e.preventDefault();
      stopMedia();
      setTimeout(() => {
        navigation.dispatch(e.data.action);
      }, 150);
    });
    return unsub;
  }, [navigation, stopMedia]);

  useEffect(() => {
    loadingTimerRef.current = setTimeout(() => {
      if (loading) {
        setError('Stream took too long to load.');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [loading]);

  const handleLoadFinish = useCallback(() => {
    loadingTimerRef.current && clearTimeout(loadingTimerRef.current);
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setError('Failed to load stream.');
    setLoading(false);
    loadingTimerRef.current && clearTimeout(loadingTimerRef.current);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  if (error || !streamUrl) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <StatusBar hidden />
        <AlertTriangle size={48} color="#E5344E" />
        <Text style={{ color: '#fff', fontSize: 18, marginTop: 16, textAlign: 'center', fontWeight: '600' }}>
          {error || 'No stream URL provided'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 32, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar hidden />

      <GeckoView
        ref={geckoRef}
        style={{ flex: 1, backgroundColor: '#000' }}
        source={{ uri: streamUrl }}
        forceDarkOn
        injectedJavaScript={INJECT_JS}
        onLoadingFinish={handleLoadFinish}
        onLoadingError={handleError}
      />

      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
          <ActivityIndicator size="large" color="#CFFF3D" />
        </View>
      )}

      <TouchableOpacity
        onPress={handleBack}
        style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
        activeOpacity={0.7}
      >
        <ArrowLeft size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
}
