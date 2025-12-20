import React from "react";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Home Icon
export function HomeIcon({ size = 24, color = "#000" }: IconProps) {
  return <MaterialCommunityIcons name="home" size={size} color={color} />;
}

// Profile/User Icon
export function UserIcon({ size = 24, color = "#000" }: IconProps) {
  return <MaterialCommunityIcons name="account" size={size} color={color} />;
}

// Settings/Gear Icon
export function SettingsIcon({ size = 24, color = "#000" }: IconProps) {
  return <MaterialCommunityIcons name="cog" size={size} color={color} />;
}

// Camera Icon
export function CameraIcon({ size = 24, color = "#999" }: IconProps) {
  return <Feather name="camera" size={size} color={color} />;
}

// Gallery/Image Icon (for no posts)
export function GalleryIcon({ size = 48, color = "#9CA3AF" }: IconProps) {
  return <MaterialCommunityIcons name="image-off" size={size} color={color} />;
}

// Back Arrow Icon
export function BackArrowIcon({ size = 20, color = "#111827" }: IconProps) {
  return <MaterialCommunityIcons name="arrow-left" size={size} color={color} />;
}

// Three Dots Menu Icon
export function ThreeDotsIcon({ size = 24, color = "#6B7280" }: IconProps) {
  return <MaterialCommunityIcons name="dots-vertical" size={size} color={color} />;
}

// Chat/Message Icon
export function ChatIcon({ size = 24, color = "#000" }: IconProps) {
  return <Feather name="message-circle" size={size} color={color} />;
}
