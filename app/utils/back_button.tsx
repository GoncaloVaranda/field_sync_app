import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface BackButtonProps {
  /** Additional styling for positioning */
  style?: ViewStyle;
  /** Icon size */
  iconSize?: number;
  /** Icon color */
  iconColor?: string;
}

/**
 * Reusable BackButton component using Expo Router.
 */
export default function BackButton({
  style,
  iconSize = 30,
  iconColor = 'black',
}: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
});
