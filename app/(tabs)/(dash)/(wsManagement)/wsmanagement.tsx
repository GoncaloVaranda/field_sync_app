import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import LogoutModal from "../../../utils/LogoutModal";


export default function Wsmanagement() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();

    return(
        <ScrollView>

            <BackButton/>
            
            <LogoutModal username={username.toString()} token={token.toString()} router={router} />



        </ScrollView>

    );


}

const styles = StyleSheet.create({
    container: {
            gap: 32,
        },
});