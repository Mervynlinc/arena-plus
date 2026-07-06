import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const LOADING_TIMEOUT = 30000;

const INJECTED_JS = `
(function() {
  var origWarn = console.warn;
  console.warn = function(msg) {
    if (typeof msg === 'string' && msg.indexOf('sandbox') !== -1) {
      return;
    }
    return origWarn.apply(console, arguments);
  };

  function removeSandboxFromIframes() {
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function(iframe) {
      if (iframe.hasAttribute('sandbox')) {
        iframe.removeAttribute('sandbox');
      }
    });
  }
  removeSandboxFromIframes();
  var sandboxObserver = new MutationObserver(function() {
    removeSandboxFromIframes();
  });
  if (document.body) {
    sandboxObserver.observe(document.body, { childList: true, subtree: true });
  }
  setTimeout(function() { sandboxObserver.disconnect(); }, 10000);

  window.open = function() { return null; };

  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (link && link.target === '_blank') {
      e.preventDefault();
      link.target = '_self';
      if (link.href && link.href.indexOf('javascript:') !== 0) {
        window.location.href = link.href;
      }
    }
  }, true);

  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(meta);

  document.body.style.touchAction = 'manipulation';
  document.documentElement.style.touchAction = 'manipulation';

  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.backgroundColor = '#000';

  var containers = document.querySelectorAll('.player-container, #player, .video-player, [class*="player"], [id*="player"], .video-wrapper, .embed-responsive');
  containers.forEach(function(el) {
    el.style.width = '100vw';
    el.style.height = '100vh';
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.zIndex = '9999';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.maxWidth = 'none';
    el.style.maxHeight = 'none';
  });

  var hide = 'header, nav, .header, .navbar, .nav, .sidebar, .menu, .top-bar, .banner, .footer, .ad-container, [class*="ad-"], [id*="ad-"], .ad, [class*="banner"], .cookie, .popup, [class*="popup"]';
  document.querySelectorAll(hide).forEach(function(el) {
    el.style.display = 'none';
  });

  var iframes = document.querySelectorAll('iframe');
  iframes.forEach(function(iframe) {
    iframe.removeAttribute('sandbox');
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.zIndex = '9999';
  });

  setTimeout(function() {
    try {
      var allIframes = document.querySelectorAll('iframe');
      for (var i = 0; i < allIframes.length; i++) {
        var src = allIframes[i].src || allIframes[i].getAttribute('src') || '';
        if (src.indexOf('embedhd') !== -1 && window.location.href.indexOf('embedhd') === -1) {
          window.location.href = src;
          return;
        }
      }
    } catch(e) {}
  }, 2000);
})();
true;
`;

export default function PlayerScreen() {
  const { url } = useLocalSearchParams<{ url: string; title?: string }>();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLoadRef = useRef(false);

  const isLandscape = width > height;

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    loadingTimerRef.current = setTimeout(() => {
      if (loading) {
        setError('Stream took too long to load. Check your connection and try again.');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [loading]);

  const handleLoadEnd = useCallback(() => {
    didLoadRef.current = true;
    setLoading(false);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
  }, []);

  const handleError = useCallback(() => {
    setError('Failed to load stream. Please try again.');
    setLoading(false);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
  }, []);

  if (error) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-8">
        <StatusBar hidden={isLandscape} />
        <AlertTriangle size={48} color="#E5344E" />
        <Text className="text-white text-lg mt-4 text-center font-semibold">{error}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 py-3 px-8 bg-white/10 rounded-xl">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden={isLandscape} />

      <WebView
        source={{ uri: url }}
        style={{ flex: 1, backgroundColor: '#000' }}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onShouldStartLoadWithRequest={(request) => {
          if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
            return false;
          }
          if (!didLoadRef.current) {
            return true;
          }
          if (request.url.includes('embed.st') || request.url.includes('embedhd')) {
            return true;
          }
          return false;
        }}
        injectedJavaScript={INJECTED_JS}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        renderLoading={() => (
          <View className="absolute inset-0 justify-center items-center bg-black">
            <ActivityIndicator size="large" color="#CFFF3D" />
          </View>
        )}
        startInLoadingState
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      />

      <View className="absolute top-0 left-0 right-0" style={{ paddingTop: isLandscape ? 16 : 60 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/40 justify-center items-center ml-4"
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
