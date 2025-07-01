import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface CardLogoProps {
  width?: number;
  height?: number;
}

export const VisaLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#1A1F71"/>
    <Path
      d="M16.5 8.5l-1.4 7h-1.7l1.4-7h1.7zm7.2 4.5c0-1.7-2.4-1.8-2.4-2.6 0-.2.2-.5.7-.5.4 0 .8.1 1.1.2l.2-1.3c-.3-.1-.7-.2-1.3-.2-1.3 0-2.3.7-2.3 1.7 0 .7.7 1.1 1.1 1.5.5.4.7.6.7.8 0 .5-.6.7-1.1.7-.5 0-1-.1-1.4-.4l-.2 1.4c.4.1.9.3 1.6.3 1.4 0 2.4-.7 2.4-1.8zm3.7-4.5h-1.2c-.4 0-.7.2-.8.5l-2.2 6.2h1.5l.3-.8h1.8l.1.8h1.3l-.8-6.7zm-1.5 4.7l.7-2.1.4 2.1h-1.1zm-6.2-4.7l-1.5 6.7h-1.4l-1-5.1c-.1-.3-.1-.4-.4-.5-.4-.2-1-.4-1.6-.5l.1-.6h2.7c.4 0 .7.2.7.6l.7 3.5 1.5-4.1h1.5z"
      fill="white"
    />
  </Svg>
);

export const MastercardLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40.45 25" fill="none">
    <Rect x="14.76" y="2.67" width="10.94" height="19.66" fill="#FF5F00"/>
    <Path 
      d="M15.45,12.5c0-3.99,1.87-7.54,4.77-9.83C18.1,1,15.42,0,12.5,0C5.6,0,0,5.6,0,12.5S5.6,25,12.5,25c2.92,0,5.6-1,7.72-2.67-2.91-2.29-4.77-5.84-4.77-9.83Z" 
      fill="#EB001B"
    />
    <Path 
      d="M40.45,12.5c0,6.9-5.6,12.5-12.5,12.5-2.92,0-5.6-1-7.72-2.67,2.91-2.29,4.77-5.84,4.77-9.83s-1.87-7.54-4.77-9.83C22.33,1,25.03,0,27.95,0c6.9,0,12.5,5.6,12.5,12.5Z" 
      fill="#F79E1B"
    />
  </Svg>
);

export const AmexLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#006FCF"/>
    <Path
      d="M8 9h2.5l.8 1.8.8-1.8h2.5l-1.5 2.5 1.5 2.5h-2.5l-.8-1.8-.8 1.8h-2.5l1.5-2.5L8 9zm12 0h2v6h-2V9zm2.5 0h3.5v1h-1.5v.8h1.3v1h-1.3v.7h1.5v1h-3.5V9zm-5.5 0h2.2l1.2 4.2 1.2-4.2h2.2l-2 6h-2.8l-2-6z"
      fill="white"
    />
  </Svg>
);

export const DiscoverLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#FF6000"/>
    <Path
      d="M8 9h2.5c1.2 0 2.2 1 2.2 2.2v.6c0 1.2-1 2.2-2.2 2.2H8V9zm1.2 1v3h1.3c.6 0 1-.4 1-1v-.6c0-.6-.4-1-1-1H9.2zm4.3-1h1.5v5h-1.5V9zm2.5 0h1.5l1 2 1-2h1.5l-1.5 2.5 1.5 2.5h-1.5l-1-2-1 2h-1.5l1.5-2.5L16 9zm8 1.2c0-.4-.3-.7-.7-.7s-.7.3-.7.7.3.7.7.7.7-.3.7-.7z"
      fill="white"
    />
    <Circle cx="32" cy="12" r="4" fill="#FF6000" opacity="0.7"/>
  </Svg>
);

export const ApplePayLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#000"/>
    <Path
      d="M8.5 8.2c-.2-2.2 1.8-4.2 4.1-4.2.2 2.4-2.1 4.4-4.1 4.2zm1.4 1.8c-1.7-.1-3.2 1-4 1-.9 0-2.1-1-3.5-1-1.8 0-3.5 1.1-4.4 2.7-1.9 3.3-.5 8.2 1.4 11 .9 1.4 2 2.9 3.4 2.9 1.3-.1 1.8-.8 3.4-.8 1.5 0 2 .8 3.4.8 1.4-.1 2.4-1.4 3.3-2.8.6-.9 1.1-1.9 1.3-2.9-2.8-1.1-3.3-5.2-.3-6.9-.8-1.2-2.1-2-3.5-2zm12.6 8.5c-1.2 0-2.3-.9-2.3-2.1v-4.2h1v4.1c0 .7.5 1.2 1.3 1.2s1.3-.5 1.3-1.2v-4.1h1v4.2c0 1.2-1.1 2.1-2.3 2.1zm7.8-6.3h-1.5v1.3h1.4v.9h-1.4v2h1.6v.9h-2.6v-6h2.5v.9zm3.7 6.3c-1.4 0-2.4-1-2.4-2.4s1-2.4 2.4-2.4 2.4 1 2.4 2.4-1 2.4-2.4 2.4zm0-.9c.8 0 1.4-.6 1.4-1.5s-.6-1.5-1.4-1.5-1.4.6-1.4 1.5.6 1.5 1.4 1.5z"
      fill="white"
    />
  </Svg>
);

export const GooglePayLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#4285F4"/>
    <Path
      d="M15.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5-4.5-2-4.5-4.5zm7.5 0c0-1.7-1.3-3-3-3s-3 1.3-3 3 1.3 3 3 3 3-1.3 3-3zm-11-2.5v1.5h-3.5c-.1-.5-.1-1-.1-1.5 0-3.3 2.2-6 5.1-6 1.4 0 2.6.5 3.5 1.4l-1.1 1.1c-.6-.6-1.4-1-2.4-1-1.9 0-3.5 1.6-3.5 3.5 0 .3 0 .7.1 1h5.9v1.5h-6c.5 1.6 2 2.8 3.9 2.8 1.1 0 2-.4 2.7-1l1.1 1.1c-.9.8-2.1 1.3-3.8 1.3-3.1 0-5.6-2.5-5.6-5.6 0-.5.1-1 .2-1.5h-1.5z"
      fill="white"
    />
    <Path
      d="M32 9.5h1.5v5c0 2.5-1.5 4-4 4s-4-1.5-4-4v-5h1.5v5c0 1.4.9 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-5z"
      fill="white"
    />
  </Svg>
);

export const StripeLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#635BFF"/>
    <Path
      d="M8.5 10.5c0-.8.6-1.3 1.6-1.3 1.4 0 3.2.4 4.6 1.2V7.8c-1.5-.6-3-.9-4.6-.9-3.8 0-6.4 2-6.4 5.3 0 5.2 7.1 4.4 7.1 6.6 0 .9-.8 1.4-1.9 1.4-1.6 0-3.7-.7-5.3-1.6v2.7c1.7.8 3.5 1.2 5.3 1.2 3.9 0 6.6-1.9 6.6-5.3 0-5.6-7.1-4.6-7.1-6.7zm19.3-3.4c-1.5 0-2.7.8-3.3 2l-.1-1.8h-2.4v14.4h2.6v-5.1c.6 1.1 1.7 1.9 3.3 1.9 3.3 0 5.6-2.7 5.6-6.7s-2.3-6.7-5.7-6.7zm-.6 10.8c-1.8 0-3.1-1.5-3.1-3.4s1.3-3.4 3.1-3.4 3.1 1.5 3.1 3.4-1.3 3.4-3.1 3.4z"
      fill="white"
    />
  </Svg>
);

export const GenericCardLogo: React.FC<CardLogoProps> = ({ width = 40, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 24" fill="none">
    <Rect width="40" height="24" rx="4" fill="#6B7280" stroke="#D1D5DB" strokeWidth="1"/>
    <Rect x="4" y="6" width="32" height="2" fill="#9CA3AF"/>
    <Rect x="4" y="10" width="8" height="1.5" fill="#9CA3AF"/>
    <Rect x="4" y="12" width="12" height="1.5" fill="#9CA3AF"/>
    <Rect x="28" y="16" width="8" height="2" fill="#9CA3AF"/>
  </Svg>
);

interface CardTypeLogoProps extends CardLogoProps {
  cardType: string | null;
}

export const CardTypeLogo: React.FC<CardTypeLogoProps> = ({ cardType, width, height }) => {
  switch (cardType) {
    case 'visa':
      return <VisaLogo width={width} height={height} />;
    case 'mastercard':
      return <MastercardLogo width={width} height={height} />;
    case 'amex':
    case 'american express':
      return <AmexLogo width={width} height={height} />;
    case 'discover':
      return <DiscoverLogo width={width} height={height} />;
    case 'applepay':
    case 'apple pay':
      return <ApplePayLogo width={width} height={height} />;
    case 'googlepay':
    case 'google pay':
      return <GooglePayLogo width={width} height={height} />;
    case 'stripe':
      return <StripeLogo width={width} height={height} />;
    default:
      return <GenericCardLogo width={width} height={height} />;
  }
};