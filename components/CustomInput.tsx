import { Text, TextInput, View, type TextInputProps } from 'react-native';

type CustomInputProps = TextInputProps & {
  label: string;
  containerClassName?: string;
  error?: string | null;
};

export function CustomInput({
  label,
  containerClassName = '',
  error,
  ...props
}: CustomInputProps) {
  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`rounded-2xl border px-4 py-4 text-[15px] text-slate-950 ${
          error ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
        }`}
        {...props}
      />
      {error ? <Text className="mt-2 text-sm text-rose-500">{error}</Text> : null}
    </View>
  );
}
