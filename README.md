# UI Colors Generator

A professional-grade color palette generator inspired by [uicolors.app](https://uicolors.app/). This tool allows you to generate consistent, perceptually uniform color scales for Tailwind CSS using the OKLCH color space.

## ✨ Features

- **OKLCH Color Scales**: Uses the modern OKLCH color space for perceptually accurate lightness across all hues.
- **Instant Generation**: Press `Space` to generate a random base color instantly.
- **Smart Color Matching**: Automatically detects the closest color name for your selection.
- **Tailwind & CSS Export**: Easy-to-copy configuration for Tailwind CSS or CSS variables.
- **Live UI Preview**: See how your colors look in real-world components (Buttons, Cards, Inputs, etc.).
- **Collapsible Export Section**: Keep your workspace clean with a toggleable export panel.
- **Contrast Tones**: Automatically calculates high-contrast text colors for every shade.

## 🚀 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Culori**: Used for professional color manipulation and OKLCH interpolation.

## 🛠️ Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## 🎨 Why OKLCH?

Unlike HSL, OKLCH provides **perceptual uniformity**. This means that two colors with the same "lightness" value (L) will actually look equally bright to the human eye, regardless of their hue. This is crucial for creating accessible and professional color palettes where the "500" shade of Blue feels just as bright as the "500" shade of Orange.

---

Built with ❤️ by [Antigravity](https://github.com/google-deepmind)
