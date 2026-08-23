import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSignInWithGoogle } from '@clerk/expo/google';
import GoogleIcon from '@/components/GoogleIcon';

const MIN_USERNAME = 4;
const MAX_USERNAME = 64;
const MAX_ATTEMPTS = 12;

function deriveUsername(email: string): string {
  const [local, domain] = email.split('@');
  let base = (local ?? '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  base = base.replace(/^_+|_+$/g, '');

  if (base.length > MAX_USERNAME) {
    base = base.slice(0, MAX_USERNAME);
  }

  if (base.length < MIN_USERNAME) {
    let seed = 0;
    for (const ch of domain ?? '') seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    let suffix = seed.toString(36).replace(/[^a-z0-9]/g, '');
    while (suffix.length < MIN_USERNAME - base.length) suffix += '0';
    base += suffix.slice(0, MIN_USERNAME - base.length);
  }

  return base;
}

export default function GoogleSignInButton() {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPress = async () => {
    if (pending) return;
    setPending(true);
    setError(null);

    try {
      const { createdSessionId, setActive, signUp } = await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
        return;
      }

      if (setActive && signUp?.missingFields?.includes('username')) {
        if (!signUp.emailAddress) {
          setError('Google sign-up needs more information. Please use email sign up instead.');
          return;
        }

        const base = deriveUsername(signUp.emailAddress);
        let taken = false;

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          const candidate = attempt === 0 ? base : `${base}${attempt}`;
          try {
            const res = await signUp.update({ username: candidate });
            if (res?.status === 'complete' && res.createdSessionId) {
              await setActive({ session: res.createdSessionId });
              router.replace('/(tabs)');
              return;
            }
            setError('Google sign-up needs more information. Please use email sign up instead.');
            return;
          } catch (e) {
            const err = e as { code?: string; message?: string };
            const message = err.message?.toLowerCase() ?? '';
            taken =
              err.code === 'form_username_identifier_exists' ||
              message.includes('already taken') ||
              message.includes('is taken');
            if (taken) continue;
            setError(err.message || 'Could not sign in with Google.');
            return;
          }
        }

        setError(taken ? 'That username is taken. Please sign up with email instead.' : 'Could not complete Google sign-up. Please try again.');
        return;
      }

      setError('Could not sign in with Google. Please try again.');
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (err.code === 'SIGN_IN_CANCELLED' || err.code === '-5') return;
      setError(err.message || 'Could not sign in with Google.');
    } finally {
      setPending(false);
    }
  };

  return (
    <View className="w-full">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="flex-row items-center justify-center rounded-2xl py-4 px-6 bg-bgCard2 border border-stroke"
      >
        {pending ? (
          <ActivityIndicator size="small" color="#A1A1AA" />
        ) : (
          <>
            <GoogleIcon size={18} />
            <Text className="font-inter font-bold text-base text-text ml-3">
              Continue with Google
            </Text>
          </>
        )}
      </TouchableOpacity>
      {error ? (
        <Text className="font-inter font-normal text-[13px] leading-[18px] text-liveRed mt-3">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
