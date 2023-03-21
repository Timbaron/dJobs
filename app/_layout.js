import { Stack } from "expo-router";
import { useCallback } from "react";
import { useFonts } from "expo-font";

/* It prevents the splash screen from hiding automatically. */
import * as SplashScreen from "expo-splash-screen";
import { Text } from "react-native";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  /* Loading the fonts and then hiding the splash screen. */
  const [ fontsLoaded ] = useFonts({
    DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
    DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
    DMRegular: require('../assets/fonts/DMSans-Regular.ttf'),
  });
  /* A function that is called when the root view is laid out. */
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  /* Checking if the fonts are loaded. If they are not, it returns null. If they are, it returns the
    Stack. */
  if (!fontsLoaded) return null;
  return <Stack onLayout={onLayoutRootView} />;
};

export default Layout;
