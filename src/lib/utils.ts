import type { ColorScale } from "@/types"

// Helper: Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s, l]
}

// Helper: Convert HSL back to RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360

  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r, g, b
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// Helper: Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")
}

// Helper: Convert HEX to RGB
export function hexToRgb(hex: string) {
  const cleaned = hex.replaceAll("#", "")
  if (cleaned.length !== 6) throw new Error("Invalid hex color")

  const r = parseInt(cleaned.slice(0, 2), 16)
  const g = parseInt(cleaned.slice(2, 4), 16)
  const b = parseInt(cleaned.slice(4, 6), 16)

  return [r, g, b]
}

// Convert HEX to HSL
export function hexToHsl(hex: string) {
  const cleaned = hex.replaceAll("#", "")
  if (cleaned.length !== 6) throw new Error("Invalid hex color")

  // Convert hex to RGB
  const r = parseInt(cleaned.substring(0, 2), 16) / 255
  const g = parseInt(cleaned.substring(2, 4), 16) / 255
  const b = parseInt(cleaned.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [
    h * 360, // Convert to degrees
    s * 100, // Convert to percentage
    l * 100, // Convert to percentage
  ]
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  // Normalize inputs
  h = h % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s // Chroma
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h < 60) {
    ;[r, g, b] = [c, x, 0]
  } else if (h < 120) {
    ;[r, g, b] = [x, c, 0]
  } else if (h < 180) {
    ;[r, g, b] = [0, c, x]
  } else if (h < 240) {
    ;[r, g, b] = [0, x, c]
  } else if (h < 300) {
    ;[r, g, b] = [x, 0, c]
  } else {
    ;[r, g, b] = [c, 0, x]
  }

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, "0")

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

type HSLColor = {
  h: number
  s: number
  l: number
}

/**
 * Calculates the distance between two HSL colors
 * @param hsl1 - First HSL color
 * @param hsl2 - Second HSL color
 * @returns Distance between the colors
 */
export function hslDistance(hsl1: HSLColor, hsl2: HSLColor) {
  // Handle hue wraparound (0° and 360° are the same)
  let hueDiff = Math.abs(hsl1.h - hsl2.h)
  if (hueDiff > 180) {
    hueDiff = 360 - hueDiff
  }

  // Weight the components differently - hue is most important for perception
  const hueWeight = 2
  const satWeight = 1
  const lightWeight = 1

  return Math.sqrt(Math.pow(hueDiff * hueWeight, 2) + Math.pow(hsl1.s - hsl2.s, 2) * satWeight + Math.pow(hsl1.l - hsl2.l, 2) * lightWeight)
}

// Get Random color in HEX
export function getRandomHexColor(): string {
  // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal)
  const randomColor = Math.floor(Math.random() * 16777216)

  // Convert to hexadecimal and pad with zeros if necessary
  return `#${randomColor.toString(16).padStart(6, "0")}`
}

export function isValidHexColor(hexColor: string) {
  // Remove # if present and ensure uppercase
  const cleanHex = hexColor.replaceAll("#", "").toUpperCase()

  // Validate hex format
  return /^[0-9A-F]{6}$/.test(cleanHex)
}

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Helper to create a new color scale
export function createColorScale(baseColor?: string): ColorScale {
  const color = baseColor || getRandomHexColor()
  return {
    id: generateId(),
    name: "Primary",
    baseColor: color,
  }
}