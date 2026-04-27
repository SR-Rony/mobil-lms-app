import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type CustomButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

const variantClasses = {
  primary: 'bg-brand-600 active:bg-brand-700',
  secondary: 'border border-slate-200 bg-white active:bg-slate-50',
  danger: 'bg-rose-600 active:bg-rose-700',
} as const;

const textClasses = {
  primary: 'text-white',
  secondary: 'text-slate-950',
  danger: 'text-white',
} as const;

export function CustomButton({
  title,
  loading = false,
  disabled,
  className = '',
  textClassName = '',
  variant = 'primary',
  ...props
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={`h-14 items-center justify-center rounded-2xl ${
        variantClasses[variant]
      } ${isDisabled ? 'opacity-60' : ''} ${className}`}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text className={`text-base font-semibold ${textClasses[variant]} ${textClassName}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
