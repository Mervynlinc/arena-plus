import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ActivityIndicator, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ArrowLeft, Maximize, AlertTriangle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/theme';

const EXTRACTION_TIMEOUT = 30000;

const INJECTED_JS_BEFORE = `
(function() {
  var post = function(type, payload) {
    try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload })); } catch(e) {}
  };

  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    var urlStr = typeof url === 'string' ? url : '';
    if (urlStr && (urlStr.indexOf('.m3u8') !== -1 || urlStr.indexOf('.mp4') !== -1)) {
      post('URL_FOUND', { url: urlStr });
    }
    return origOpen.apply(this, arguments);
  };

  var origFetch = window.fetch;
  window.fetch = function(url, options) {
    var urlStr = typeof url === 'string' ? url : (url && url.url ? url.url : '');
    if (urlStr && (urlStr.indexOf('.m3u8') !== -1 || urlStr.indexOf('.mp4') !== -1)) {
      post('URL_FOUND', { url: urlStr });
    }
    return origFetch.apply(this, arguments);
  };
})();
true;
`;

const INJECTED_JS_AFTER = `
(function() {
  var post = function(type, payload) {
    try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload })); } catch(e) {}
  };

  setTimeout(function() {
    try {
      var iframes = document.querySelectorAll('iframe');
      for (var i = 0; i < iframes.length; i++) {
        var src = iframes[i].src || '';
        if (src.indexOf('embedhd') !== -1) {
          post('IFRAME_FOUND', { src: src });
        }
      }
    } catch(e) {
      post('LOG', { msg: 'iframe scan: ' + e.message });
    }
  }, 1000);
})();
true;
`;

export default function PlayerScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  const { width, height } = useWindowDimensions();
  const isDirectUrl = !!(url && (url.includes('.m3u8') || url.includes('.mp4')));
  const [streamUrl, setStreamUrl] = useState<string | null>(isDirectUrl ? url : null);
  const [loading, setLoading] = useState(!isDirectUrl);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logsRef = useRef<string[]>([]);

  const addLog = useCallback((msg: string) => {
    const entry = '[' + new Date().toISOString().slice(11, 19) + '] ' + msg;
    logsRef.current = [...logsRef.current, entry].slice(-50);
    setLogs(logsRef.current);
  }, []);

  const player = useVideoPlayer(null, () => {});

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    if (!streamUrl) return;
    (async () => {
      try {
        await player.replaceAsync(streamUrl);
        player.play();
      } catch {}
    })();
  }, [streamUrl, player]);

  useEffect(() => {
    if (streamUrl) return;
    timeoutRef.current = setTimeout(() => {
      addLog('TIMEOUT: No stream URL captured in ' + (EXTRACTION_TIMEOUT / 1000) + 's');
      setError('Failed to extract stream URL. Please try again.');
      setLoading(false);
    }, EXTRACTION_TIMEOUT);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [streamUrl, addLog]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'LOG') {
          addLog('[WV] ' + data.payload.msg);
          return;
        }

        if (data.type === 'IFRAME_FOUND' && data.payload?.src) {
          addLog('[IFRAME] ' + data.payload.src);
          if (!iframeUrl) {
            setIframeUrl(data.payload.src);
            addLog('[NAV] Navigating to iframe source...');
          }
          return;
        }

        if (data.type === 'URL_FOUND' && data.payload?.url) {
          addLog('[!!!] MEDIA URL: ' + data.payload.url);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setStreamUrl(data.payload.url);
          setLoading(false);
        }
      } catch {}
    },
    [iframeUrl, addLog]
  );

  const handleWebViewError = useCallback(() => {
    addLog('[WV] WebView load error');
    if (!streamUrl) {
      setError('Failed to load stream source.');
      setLoading(false);
    }
  }, [streamUrl, addLog]);

  const webviewSource = iframeUrl ? { uri: iframeUrl } : { uri: url };
  const isLandscape = width > height;

  if (error && streamUrl) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar hidden={isLandscape} />
        <VideoView
          style={{ width: '100%', height: isLandscape ? height : width * (9 / 16) }}
          player={player}
          nativeControls
          contentFit="contain"
        />
        <ScrollView className="flex-1 px-4 pt-2 bg-black/80">
          {logs.map((log, i) => (
            <Text key={i} className="text-[10px] font-mono text-green-400 leading-4">{log}</Text>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-8">
        <StatusBar hidden={isLandscape} />
        <AlertTriangle size={48} color={colors.liveRed} />
        <Text className="text-white font-inter font-semibold text-lg mt-4 text-center">{error}</Text>
        <View className="w-full max-h-[300px] mt-4 bg-bgCard rounded-xl p-3">
          <ScrollView>
            {logs.map((log, i) => (
              <Text key={i} className="text-[10px] font-mono text-green-400 leading-4">{log}</Text>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 py-3 px-8 bg-white/10 rounded-xl">
          <Text className="text-white font-inter font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden={isLandscape} />

      {isLandscape && streamUrl && (
        <View className="absolute top-0 left-0 right-0 z-10">
          <TouchableOpacity onPress={() => router.back()} className="pt-[52px] pb-3 px-4">
            <View className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
              <ArrowLeft size={22} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {loading && !streamUrl && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
          <Text className="text-white/60 font-inter font-medium text-sm mt-3 mb-4">
            {iframeUrl ? 'Connecting to stream...' : 'Extracting stream source...'}
          </Text>
          <View className="w-full max-h-[60%] px-6">
            <ScrollView>
              {logs.map((log, i) => (
                <Text key={i} className="text-[10px] font-mono text-green-400 leading-4">{log}</Text>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {streamUrl && (
        <VideoView
          style={{ width: '100%', height: isLandscape ? height : width * (9 / 16) }}
          player={player}
          nativeControls
          contentFit="contain"
        />
      )}

      {!isLandscape && streamUrl && (
        <View className="flex-row items-center justify-between px-5 py-4 bg-black">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/10 justify-center items-center">
            <ArrowLeft size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-inter font-semibold text-base flex-1 text-center mx-3" numberOfLines={1}>
            {title || 'Now Playing'}
          </Text>
          <TouchableOpacity onPress={() => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)} className="w-10 h-10 rounded-full bg-white/10 justify-center items-center">
            <Maximize size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {!streamUrl && (
        <View style={{ position: 'absolute', width: 1, height: 1, opacity: 0.01, overflow: 'hidden' }}>
          <WebView
            key={iframeUrl || 'parent'}
            source={webviewSource}
            injectedJavaScriptBeforeContentLoaded={INJECTED_JS_BEFORE}
            injectedJavaScript={INJECTED_JS_AFTER}
            onMessage={handleMessage}
            onError={handleWebViewError}
            onLoadStart={() => addLog('[WV] loadStart: ' + (iframeUrl ? 'iframe page' : 'parent page'))}
            onLoadEnd={() => addLog('[WV] loadEnd')}
            javaScriptEnabled
            domStorageEnabled
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
            userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            style={{ width: 300, height: 200 }}
          />
        </View>
      )}
    </View>
  );
}
