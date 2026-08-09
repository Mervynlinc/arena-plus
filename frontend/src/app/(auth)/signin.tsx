import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth, useSignIn } from '@clerk/expo';
import { Redirect, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import Button from '@/components/Button';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import ScreenContainer from '@/components/ScreenContainer';

export default function SignInScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const showBack = router.canGoBack();

  const onSignInPress = async () => {
    if (pending) return;
    setPending(true);
    setError(null);

    const identifier = emailAddress.trim();
    if (!identifier) {
      setError('Enter your email address.');
      setPending(false);
      return;
    }

    const { error: signInError } = await signIn.password({ identifier, password });
    if (signInError) {
      setError(signInError.longMessage || signInError.message);
      setPending(false);
      return;
    }

    if (signIn.status === 'complete') {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage || finalizeError.message);
        setPending(false);
        return;
      }
      router.replace('/(tabs)');
    } else {
      setError('Additional verification is required to complete sign in.');
      setPending(false);
    }
  };

  if (!isLoaded) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#CFFF3D" />
        </View>
      </ScreenContainer>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6 pt-16 pb-10">
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-fit">
              <Text className="font-inter font-normal text-[22px] text-text">←</Text>
            </TouchableOpacity>
          ) : null}

          <View className="flex-1 justify-center">
            <View>
              <Text className="font-display text-[44px] leading-[46px] text-text">
                Welcome Back.
              </Text>
              <Text className="font-inter font-normal text-sm leading-[21px] text-textMuted mt-3">
                Sign in to keep following your teams, matches and live scores.
              </Text>
            </View>

            <View className="mt-10 gap-4">
              <View className="bg-bgCard border border-stroke rounded-2xl px-4">
                <TextInput
                  className="font-inter text-base text-text py-4"
                  placeholder="Email address"
                  placeholderTextColor="#5C5C63"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>
              <View className="bg-bgCard border border-stroke rounded-2xl px-4 flex-row items-center">
                <TextInput
                  className="font-inter text-base text-text py-4 flex-1"
                  placeholder="Password"
                  placeholderTextColor="#5C5C63"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={onSignInPress}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  activeOpacity={0.7}
                  className="ml-2 pl-3"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#5C5C63" />
                  ) : (
                    <Eye size={20} color="#5C5C63" />
                  )}
                </TouchableOpacity>
              </View>

              {error ? (
                <Text className="font-inter font-normal text-[13px] leading-[18px] text-liveRed">
                  {error}
                </Text>
              ) : null}

              <Button
                label={pending ? 'Signing in…' : 'Sign In'}
                onPress={onSignInPress}
                fullWidth
              />
            </View>
          </View>

          <View className="mt-auto">
            <View className="flex-row items-center gap-4">
              <View className="h-[1px] flex-1 bg-stroke" />
              <Text className="font-inter font-medium text-xs text-textSecondary">or</Text>
              <View className="h-[1px] flex-1 bg-stroke" />
            </View>

            <View className="mt-6">
              <GoogleSignInButton />
            </View>

            <View className="flex-row justify-center items-center gap-1 mt-6">
              <Text className="font-inter font-normal text-sm text-textMuted">
                New to Streamed?
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')} activeOpacity={0.7}>
                <Text className="font-inter font-semibold text-sm text-accent">
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
