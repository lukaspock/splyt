import React from 'react';
import {View, Text} from "react-native";
import {defaultStyles as style} from "@/constants/defaultStyles";
import { Heart } from "lucide-react-native";
const Home = () => {
    return (
        <View style={style.container}>
            <Text>Welcome Home!</Text>
            <Heart size={24} color="black" />
        </View>
    );
};

export default Home;