import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import React from "react";

const _Layout = () => {
    return (
        <Tabs>
      <Tabs.Screen 
        name="index"    // notar o caminho relativo
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-back-outline" size={size} color={color} />
          ),
          headerShown: false, 
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          tabBarButton: () => null,   
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          tabBarButton: () => null,   
          headerShown: false,
        }}
      />
    </Tabs>
    );
}
export default _Layout;
