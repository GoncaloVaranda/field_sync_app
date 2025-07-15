
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


export default function Dashboard() {
  const router = useRouter();
  const { token, username } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const handleLogout = () => {
    // Clear user session, token, etc. (you can add your logout logic here)
    console.log("Logged out");
    setIsModalVisible(false); // Hide the modal
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.usernameButton}>

        settings-outline
        
        <Pressable onPress={() => setIsModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}> 
          <Text>{username}  </Text>
          <Ionicons name ="settings-outline" size={18}></Ionicons>
        </Pressable>

        {/* Modal for logout */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)} // Handle modal close on hardware back press (Android)
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{username}</Text>
              <Button title="Logout" onPress={handleLogout} />
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)} // Close the modal without logging out
              />
            </View>
          </View>
        </Modal>
      </View>


      <View style={styles.logoContainer}>
                <Image
                    source={require("../../../assets/images/logo.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.containerWrapper}>
                <Text style={styles.pageTitle}>Dashboard</Text>

                <View style={styles.container}>
                        <Pressable style={styles.mainCard} onPress={() => router.push(`/changeattributes?token=${token}&username=${username}`)}>
                            <Text style={styles.mainIcon}>👤</Text>
                            <Text style={styles.mainTitle}>Gestão de Contas</Text>
                            <Text style={styles.mainDesc}>Aqui pode gerir todas as operações relacionadas com contas de utilizador.</Text>
                        </Pressable>

                        <Pressable style={styles.mainCard} onPress={() => router.push(`/changepassword?token=${token}&username=${username}`)}>
                            <Text style={styles.mainIcon}>📝</Text>
                            <Text style={styles.mainTitle}>Gestão de Worksheets</Text>
                            <Text style={styles.mainDesc}>Aqui pode importar, ver e gerir folhas de obra</Text>
                        </Pressable>
                </View>
            </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    usernameButton: {
        position: "absolute", // Position the element absolutely
        top: 40, // Set distance from the top of the screen
        right: 20, // Set distance from the right of the screen
        padding: 10,
    },
    modalOverlay: {
        position: "absolute", // This positions the overlay on top of the screen
        top: 0, // Align to the top
        left: 0, // Align to the left
        width: "100%", // Cover the full width of the screen
        height: "100%", // Cover the full height of the screen
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        justifyContent: "flex-start", // Align modal container at the top
      
  },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        marginTop: 20, // Add margin to push the modal down a bit
        marginLeft: 20, // Add margin to the left to avoid it being right at the edge
        marginRight: 20,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    logoContainer: {
        position: 'absolute',
        top: 30,
        left: -15,
        zIndex: -10,
        width: 200,
        height: 100,
    },
    containerWrapper: {
        flex: 1,
        padding: 32,
        maxWidth: 1000,
        width: '100%',
        alignSelf: 'center',
        paddingTop: 120,
        paddingBottom: 40,
    },
    pageTitle: {
        fontSize: 48,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 24,
        textAlign: 'center',
    },
    container: {
        flexDirection: Dimensions.get('window').width > 600 ? 'row' : 'column',
        gap: 32,
    },
    mainCard: {
        flex: 1,
        minWidth: Dimensions.get('window').width > 600 ? 300 : '100%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    mainTitle: {
        fontSize: 24,
        marginBottom: 8,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    mainDesc: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666666',
    },
    logoImage: {
        width: 120,
        height: 100,
    },
});
