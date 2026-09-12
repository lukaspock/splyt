import {defaultStyles as style} from "@/constants/defaultStyles";

import {SafeAreaView} from "react-native-safe-area-context";
import LoginScreen from "@/components/LoginScreen";


Login.propTypes = {

};

function Login() {

    return (

        <SafeAreaView style={ style.container}>
            <LoginScreen/>
        </SafeAreaView>
    );


}

export default Login;
