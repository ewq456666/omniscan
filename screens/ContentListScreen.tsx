import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { ContentCard } from '@/components/ContentCard';
import { RootStackParamList } from '@/navigation/types';

export function ContentListScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { content } = useMockDataStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Library</Text>
      <FlatList
        data={content}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContentCard
            item={item}
            onPress={() => navigation.navigate('ContentDetail')}
          />
        )}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
});
