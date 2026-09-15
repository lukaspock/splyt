import {SafeAreaView} from "react-native-safe-area-context";
import OnboardingScreen from "@/components/OnboardingScreen";

function Onboarding() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <OnboardingScreen/>
        </SafeAreaView>
    );
}

export default Onboarding;
