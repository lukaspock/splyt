import {SafeAreaView} from "react-native-safe-area-context";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import DashboardScreen from "@/components/DashboardScreen";

function Home() {
    return (
        <SafeAreaView style={bstyle.screen} edges={["top", "bottom"]}>
            <DashboardScreen/>
        </SafeAreaView>
    );
}

export default Home;
