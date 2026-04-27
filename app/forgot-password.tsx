import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/AuthHeader';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-10 pt-4">
          <AuthHeader
            badge="Secure Account Recovery"
            title="Reset your password"
            subtitle="We&apos;ll send a secure reset link so you can quickly return to your classes and coursework."
          />

          <View className="-mt-8 rounded-[32px] border border-white/70 bg-white px-5 py-6 shadow-soft">
            <CustomInput
              label="Email Address"
              placeholder="student@osthad.app"
              keyboardType="email-address"
              autoCapitalize="none"
              containerClassName="mb-6"
            />

            <CustomButton title="Send Reset Link" />

            <View className="mt-6 flex-row items-center justify-center">
              <Text className="text-sm text-slate-500">Remembered your password? </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-sm font-semibold text-brand-700">Back to login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
