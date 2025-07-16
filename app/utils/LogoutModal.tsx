import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AuthService from "../../services/Integration";

interface LogoutModalProps {
  username: string;
  token: string;
  role: string;
  router: Router;
  //onLogout: (token: string) => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ username, token, role, router }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
      
       try {   
          const data = await AuthService.logout(token);
            
          console.log("Logged out");
          setIsModalVisible(false); // Hide the modal
              
        

          router.dismissAll();
          router.dismissAll();
          } catch (err: unknown) {
              if (err instanceof Error) {
                  console.log(err.message);
                  router.dismissAll();
                  router.dismissAll();
                  Alert.alert('Error', err.message, [
                               { text: 'I understand' },
                                ]);
              } else {
                console.log("Erro inesperado:", err);
              }
          } finally{
              setIsLoading(false);
          }
    };

  return (
    <View style={styles.usernameButton}>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text>{username} </Text>
        <Ionicons name="settings-outline" size={18} />
      </Pressable>

      {/* Modal for logout */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalUsername}>{username}</Text>
            <Text style={styles.modalRole}>{role}</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
                 ) : (
                <Button title="Logout" onPress={handleLogout} />
              )}
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
            />
          </View>
        </View>
        
        
      </Modal>
    </View>
  );
};

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
  modalUsername: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalRole: {
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default LogoutModal;