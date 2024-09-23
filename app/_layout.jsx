import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

export { ErrorBoundary } from 'expo-router';


export default function AppRootLayout() {
    return (
        <>
            <MainAppLayout />
        </>
    );
}

function MainAppLayout() {
  const colorScheme = useColorScheme();

  return (
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack initialRouteName="(tabs)">
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="new-post" options={{ title: 'New Post', presentation: 'modal',headerShown: false }} />
                <Stack.Screen name="comment" options={{ title: 'Post Comment', presentation: 'modal',headerShown: false }} />
                <Stack.Screen name="retweet" options={{ title: 'Re Tweet', presentation: 'modal',headerShown: false }} />
              </Stack>
            </ThemeProvider>
  );
}
