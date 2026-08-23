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
import { useAuth, useSignUp } from '@clerk/expo';
import { Redirect, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import Button from '@/components/Button';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import ScreenContainer from '@/components/ScreenContainer';

export default function SignUpScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/signin');
    }
  };

  const onSignUpPress = async () => {
    if (pending) return;
    setPending(true);
    setError(null);

    const { error: signUpError } = await signUp.password({
      emailAddress,
      username,
      password,
    });
    if (signUpError) {
      setError(signUpError.longMessage || signUpError.message);
      setPending(false);
      return;
    }

    if (signUp.status === 'complete') {
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage || finalizeError.message);
        setPending(false);
        return;
      }
      router.replace('/(tabs)');
      return;
    }

    if (signUp.isTransferable) {
      setError('An account already exists for this email. Please sign in instead.');
      setPending(false);
      return;
    }

    const missingFields = (signUp.missingFields ?? []).filter((field) => field !== 'email_address');
    if (missingFields.length > 0) {
      setError(`Missing required information: ${missingFields.join(', ')}.`);
      setPending(false);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.longMessage || sendError.message);
      setPending(false);
      return;
    }

    setIsVerifying(true);
    setPending(false);
  };

  const onVerifyPress = async () => {
    if (pending) return;
    setPending(true);
    setError(null);

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) {
      setError(verifyError.longMessage || verifyError.message);
      setPending(false);
      return;
    }

    if (signUp.status === 'complete') {
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage || finalizeError.message);
        setPending(false);
        return;
      }
      router.replace('/(tabs)');
      return;
    }

    if (signUp.isTransferable) {
      setError('An account already exists for this email. Please sign in instead.');
      setPending(false);
      return;
    }

    const missingFields = (signUp.missingFields ?? []).filter((field) => field !== 'email_address');
    if (missingFields.length > 0) {
      setError(`Missing required information: ${missingFields.join(', ')}.`);
      setPending(false);
      return;
    }

    setError('Sign-up could not be completed. Please try again.');
    setPending(false);
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
          <TouchableOpacity onPress={goBack} activeOpacity={0.7} className="w-fit">
            <Text className="font-inter font-normal text-[22px] text-text">←</Text>
          </TouchableOpacity>

          <View className="flex-1 justify-center">
            <View>
              <Text className="font-display text-[44px] leading-[46px] text-text">
                {isVerifying ? 'Check Your\nInbox.' : 'Create Your\nAccount.'}
              </Text>
              <Text className="font-inter font-normal text-sm leading-[21px] text-textMuted mt-3">
                {isVerifying
                  ? `We sent a verification code to ${emailAddress}.`
                  : 'Join Arena Plus to save your teams and never miss a game.'}
              </Text>
            </View>

            <View className="mt-10 gap-4">
            {isVerifying ? (
              <>
                <View className="bg-bgCard border border-stroke rounded-2xl px-4">
                  <TextInput
                    className="font-inter text-base text-text py-4"
                    placeholder="Verification code"
                    placeholderTextColor="#5C5C63"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={onVerifyPress}
                  />
                </View>

                {error ? (
                  <Text className="font-inter font-normal text-[13px] leading-[18px] text-liveRed">
                    {error}
                  </Text>
                ) : null}

                <Button
                  label={pending ? 'Verifying…' : 'Verify & Create Account'}
                  onPress={onVerifyPress}
                  fullWidth
                />

                <TouchableOpacity onPress={() => setIsVerifying(false)} activeOpacity={0.7}>
                  <Text className="font-inter font-normal text-[13px] text-textMuted text-center">
                    Use a different email address
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
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
                <View className="bg-bgCard border border-stroke rounded-2xl px-4">
                  <TextInput
                    className="font-inter text-base text-text py-4"
                    placeholder="Username"
                    placeholderTextColor="#5C5C63"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="username"
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
                    autoComplete="password-new"
                    returnKeyType="go"
                    onSubmitEditing={onSignUpPress}
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
                  label={pending ? 'Creating account…' : 'Create Account'}
                  onPress={onSignUpPress}
                  fullWidth
                />
              </>
            )}
          </View>
          </View>

          {!isVerifying ? (
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
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/signin')} activeOpacity={0.7}>
                  <Text className="font-inter font-semibold text-sm text-accent">Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
