import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6fff5' },
          100: { value: '#b3ffe0' },
          200: { value: '#80ffcc' },
          300: { value: '#4dffb8' },
          400: { value: '#1affa3' },
          500: { value: '#00D395' },
          600: { value: '#00a876' },
          700: { value: '#007d58' },
          800: { value: '#005239' },
          900: { value: '#00291d' },
        },
        gold: {
          50: { value: '#fff9e6' },
          100: { value: '#ffeeb3' },
          200: { value: '#ffe380' },
          300: { value: '#ffd84d' },
          400: { value: '#ffcd1a' },
          500: { value: '#FFB800' },
          600: { value: '#cc9300' },
          700: { value: '#996e00' },
          800: { value: '#664a00' },
          900: { value: '#332500' },
        },
        accent: {
          500: { value: '#7C3AED' },
          600: { value: '#6D28D9' },
        },
        surface: {
          DEFAULT: { value: '#161B22' },
          alt: { value: '#1C2128' },
          elevated: { value: '#21262D' },
        },
        border: {
          DEFAULT: { value: '#30363D' },
        },
        win: { value: '#00D395' },
        loss: { value: '#F85149' },
        active: { value: '#FFB800' },
        live: { value: '#F85149' },
      },
      fonts: {
        heading: { value: 'Inter, system-ui, -apple-system, sans-serif' },
        body: { value: 'Inter, system-ui, -apple-system, sans-serif' },
        mono: { value: 'JetBrains Mono, Fira Code, monospace' },
      },
      radii: {
        sm: { value: '6px' },
        md: { value: '8px' },
        lg: { value: '12px' },
        xl: { value: '16px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: '#ffffff', _dark: '#0D1117' } },
          subtle: { value: { _light: '#f7f8fa', _dark: '#161B22' } },
          muted: { value: { _light: '#eef0f4', _dark: '#1C2128' } },
        },
        fg: {
          DEFAULT: { value: { _light: '#1a1a2e', _dark: '#F0F6FC' } },
          subtle: { value: { _light: '#6b7280', _dark: '#8B949E' } },
          muted: { value: { _light: '#9ca3af', _dark: '#6E7681' } },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: { _dark: '#0D1117' },
      color: { _dark: '#F0F6FC' },
      fontFamily: 'body',
    },
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      bg: { _dark: '#161B22' },
    },
    '::-webkit-scrollbar-thumb': {
      bg: { _dark: '#30363D' },
      borderRadius: '3px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      bg: { _dark: '#484F58' },
    },
  },
});

export const system = createSystem(defaultConfig, config);
