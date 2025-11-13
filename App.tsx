import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, RootTabParamList } from '@/navigation/types';
import { navigationTheme } from '@/navigation/theme';
import { HomeScreen } from '@/screens/HomeScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { CameraScreen } from '@/screens/CameraScreen';
import { GalleryScreen } from '@/screens/GalleryScreen';
import { ProcessingScreen } from '@/screens/ProcessingScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';
import { ContentListScreen } from '@/screens/ContentListScreen';
import { ContentDetailScreen } from '@/screens/ContentDetailScreen';
import { ContentEditScreen } from '@/screens/ContentEditScreen';
import { useThemeColors } from '@/hooks/useThemeColors';
import { palette } from '@/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function RootTabs() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<keyof RootTabParamList, string> = {
            Home: 'home-variant',
            Search: 'magnify',
            Settings: 'cog',
          };
          return (
            <MaterialCommunityIcons
              name={iconMap[route.name as keyof RootTabParamList]}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Root" component={RootTabs} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="Processing" component={ProcessingScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="ContentList" component={ContentListScreen} />
          <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
          <Stack.Screen name="ContentEdit" component={ContentEditScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
