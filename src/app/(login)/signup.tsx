import {defaultStyles as style} from "@/constants/defaultStyles";
import {SafeAreaView} from "react-native-safe-area-context";
import SignUpScreen from "@/components/SignUpScreen";

function SignUp() {
    return (
        <SafeAreaView style={style.container}>
            <SignUpScreen/>
        </SafeAreaView>
    );
}

export default SignUp;
