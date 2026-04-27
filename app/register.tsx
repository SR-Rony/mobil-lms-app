import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/AuthHeader';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleRegister() {
    clearError();
    setFormError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError('Name, email, and password are required.');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
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
              badge="Launch Your Learning Journey"
              title="Create your student account"
              subtitle="Join a premium Bangladeshi EdTech learning space built for skill growth and consistency."
            />

            <View className="-mt-8 rounded-[32px] border border-white/70 bg-white px-5 py-6 shadow-soft">
              <CustomInput
                label="Full Name"
                placeholder="Ariana Rahman"
                containerClassName="mb-4"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (formError || authError) {
                    setFormError(null);
                    clearError();
                  }
                }}
                error={formError ? formError : null}
              />
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
              />
              <CustomInput
                label="Mobile Number"
                placeholder="+8801XXXXXXXXX"
                keyboardType="phone-pad"
                containerClassName="mb-4"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  if (formError || authError) {
                    setFormError(null);
                    clearError();
                  }
                }}
              />
              <CustomInput
                label="Password"
                placeholder="Create a strong password"
                secureTextEntry
                containerClassName="mb-4"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (formError || authError) {
                    setFormError(null);
                    clearError();
                  }
                }}
              />

              {authError ? <Text className="mb-2 text-sm text-rose-500">{authError}</Text> : null}

              <CustomButton title="Create Account" loading={isLoading} onPress={handleRegister} />

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-slate-500">Already have an account? </Text>
                <Link href="/login" asChild>
                  <Pressable>
                    <Text className="text-sm font-semibold text-brand-700">Login</Text>
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
