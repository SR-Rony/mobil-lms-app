import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type BottomNavItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: '/home' | '/courses' | '/live' | '/profile';
};

const navItems: BottomNavItem[] = [
  { key: 'home', label: 'Home', icon: 'home', href: '/home' },
  { key: 'courses', label: 'Courses', icon: 'book-outline', href: '/courses' },
  { key: 'live', label: 'Live', icon: 'calendar-outline', href: '/live' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 pb-6 pt-4">
      <View className="flex-row items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.key} href={item.href} asChild>
              <Pressable className="items-center">
                <View
                  className={`h-11 w-11 items-center justify-center rounded-2xl ${
                    isActive ? 'bg-brand-50' : 'bg-slate-100'
                  }`}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isActive ? '#2563eb' : '#64748b'}
                  />
                </View>
                <Text
                  className={`mt-2 text-xs ${
                    isActive ? 'font-semibold text-brand-700' : 'font-medium text-slate-400'
                  }`}>
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
