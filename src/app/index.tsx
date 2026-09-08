import {ActivityIndicator, View} from "react-native";
import {Redirect} from "expo-router";
import {useSession} from "@/hooks/useSession";
import {SafeAreaView} from "react-native-safe-area-context";
import {defaultStyles} from "@/constants/defaultStyles";

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <SafeAreaView style={defaultStyles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return <Redirect href={session ? "/home" : "/login"} />;
}
