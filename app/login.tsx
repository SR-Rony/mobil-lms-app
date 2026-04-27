import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/AuthHeader';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { useAuthStore } from '@/store/auth.store';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [email, setEmail] = useState('student@codezyne.com');
  const [password, setPassword] = useState('123456');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleLogin() {
    clearError();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required.');
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });
      router.replace('/home');
    } catch {
      return;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-4">
            <AuthHeader
              badge="Bangladesh's Smart LMS"
              title="Sign in and continue learning"
              subtitle="Track your classes, assignments, and live batches in one focused mobile experience."
            />

            <View className="-mt-8 rounded-[32px] border border-white/70 bg-white px-5 py-6 shadow-soft">
              <CustomInput
                label="Email Address"
                placeholder="student@codezyne.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerClassName="mb-4"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (formError || authError) {
                    setFormError(null);
                    clearError();
                  }
                }}
                error={formError ? formError : null}
              />
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                containerClassName="mb-3"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (formError || authError) {
                    setFormError(null);
                    clearError();
                  }
                }}
              />

              {authError ? (
                <Text className="mb-2 text-sm text-rose-500">{authError}</Text>
              ) : null}

              <Link href="/forgot-password" asChild>
                <Pressable className="self-end">
                  <Text className="text-sm font-semibold text-brand-700">Forgot password?</Text>
                </Pressable>
              </Link>

              <CustomButton
                title="Login to Dashboard"
                className="mt-6"
                loading={isLoading}
                onPress={handleLogin}
              />

              <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
                Demo login: student@codezyne.com / 123456
              </Text>

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-slate-500">Don&apos;t have an account? </Text>
                <Link href="/register" asChild>
                  <Pressable>
                    <Text className="text-sm font-semibold text-brand-700">Create account</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
