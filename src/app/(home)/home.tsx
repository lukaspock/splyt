import React from 'react';
import {View, Text, ActivityIndicator} from "react-native";
import {defaultStyles as style} from "@/constants/defaultStyles";
import { trpc } from "@/lib/trpc";
import {useSession} from "@/hooks/useSession";

const Home = () => {

    const { session, user, isLoading } = useSession();

    return (
        <View style={style.container}>
            <Text>Welcome Home { user?.name }!</Text>
        </View>
    );
};

export default Home;