import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import LogoutModal from "../../../utils/LogoutModal";


export default function Accmanagement() {
    const router = useRouter();
    const { token, username , role } = useLocalSearchParams();

    return(
    <View style={styles.container}>
      <BackButton />

      <LogoutModal
          username={username.toString()}
          token={token.toString()}
          role = {role.toString()}
          router={router}
        />
      
      <Text style={styles.title}>Gestão de Contas</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        

        <View style={styles.buttonsContainer}>
            <Pressable
            style={styles.button}
            onPress={() => router.push(`/changeattributes?token=${token}&username=${username}&role=${role}`)}
            >
            <Text style={styles.buttonText}>Alterar Atributos</Text>
            </Pressable>

            <Pressable
            style={styles.button}
            onPress={() => router.push(`/changepassword?token=${token}&username=${username}&role=${role}`)}
            >
            <Text style={styles.buttonText}>Mudar Palavra-passe</Text>
            </Pressable>

            <Pressable
            style={styles.button}
            onPress={() => router.push(`/changeprivacy?token=${token}&username=${username}&role=${role}`)}
            >
            <Text style={styles.buttonText}>Mudar Palavra-passe</Text>
            </Pressable>

            <Pressable
            style={styles.button}
            onPress={() => router.push(`/changepassword?token=${token}&username=${username}&role=${role}`)}
            >
            <Text style={styles.buttonText}>Mudar Palavra-passe</Text>
            </Pressable>

            <Pressable
            style={styles.button}
            onPress={() => router.push(`/changepassword?token=${token}&username=${username}&role=${role}`)}
            >
            <Text style={styles.buttonText}>Mudar Palavra-passe</Text>
            </Pressable>


        </View>
      </ScrollView>

    </View>

    );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
  },
  buttonsContainer: {
    marginTop: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
