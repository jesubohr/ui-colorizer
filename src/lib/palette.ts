import type { Oklch } from "culori"
import { rgbToHsl, hslToRgb, rgbToHex, hexToRgb, hexToHsl, hslToHex, hexToOklch, oklchToHex, hslDistance } from "./utils"
import { TAILWIND_LIGHTNESS, HSL_COLORS_BY_NAME } from "./constants"

function normalizeRGB(r: number, g: number, b: number) {
  r = Math.floor(r * 65535.0 + 0.5)
  g = Math.floor(g * 65535.0 + 0.5)
  b = Math.floor(b * 65535.0 + 0.5)

  r = Math.floor(r / 65535.0)
  g = Math.floor(g / 65535.0)
  b = Math.floor(b / 65535.0)

  return [r, g, b]
}

function hueOffset(hexColor: string, degrees: number) {
  const [r, g, b] = hexToRgb(hexColor)
  const [nR, nG, nB] = normalizeRGB(r, g, b)

  // eslint-disable-next-line prefer-const
  let [h, s, l] = rgbToHsl(nR, nG, nB)
  h += degrees
  if (h < 0) h += 360
  else if (h >= 360) h -= 360

  return hslToRgb(h, s, l)
}

export function analogous(hexColor: string) {
  const colors = []
  colors.push(hueOffset(hexColor, -30))
  colors.push(hueOffset(hexColor, 30))
  return colors.map((c) => rgbToHex(c[0], c[1], c[2]))
}

export function complementary(hexColor: string) {
  const [r, g, b] = hueOffset(hexColor, 180)
  return rgbToHex(r, g, b)
}

export function triadic(hexColor: string) {
  const colors = []
  colors.push(hueOffset(hexColor, -120))
  colors.push(hueOffset(hexColor, 120))
  return colors.map((c) => rgbToHex(c[0], c[1], c[2]))
}

export function tetradic(hexColor1: string, hexColor2: string) {
  const colors = []
  colors.push(hexToRgb(complementary(hexColor1)))
  colors.push(hexToRgb(complementary(hexColor2)))
  return colors.map((c) => rgbToHex(c[0], c[1], c[2]))
}

export function quadratic(hexColor: string) {
  const colors = []
  colors.push(hueOffset(hexColor, -90))
  colors.push(hexToRgb(complementary(hexColor)))
  colors.push(hueOffset(hexColor, 90))
  return colors.map((c) => rgbToHex(c[0], c[1], c[2]))
}

export function splitComplementary(hexColor: string) {
  return analogous(complementary(hexColor))
}

export function monochromatic(hexColor: string, count: number) {
  const [r, g, b] = hexToRgb(hexColor)
  const [nR, nG, nB] = normalizeRGB(r, g, b)

  const [h, s] = rgbToHsl(nR, nG, nB)
  const dl = Number(1.0 / (count + 1))

  const colors = []
  for (let i = 1; i <= count; i++) {
    const rgbColor = hslToRgb(h, s, Number(dl * i))
    colors.push(rgbColor)
  }

  return colors.map((c) => rgbToHex(c[0], c[1], c[2]))
}

export function contrastTone(hexColor: string): string {
  // eslint-disable-next-line prefer-const
  let [h, s, l] = hexToHsl(hexColor)

  // Invert the lightness to get a contrasting tone
  l = l == 50 && !(h < 290 && h > 200) ? l + 20 : l
  l = l > 50 ? l - 65 : l + 75
  l = Math.max(0, Math.min(100, l)) // clamp to [0,1]

  return hslToHex(h, s, l)
}

/**
 * Generate a Tailwind palette from a hex color
 * @param hexColor The hex color to generate the palette from
 * @returns The Tailwind palette
 */
export function tailwindPalette(hexColor: string) {
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const baseOklch = hexToOklch(hexColor)

  // Generate palette using OKLCH for perceptually uniform lightness
  const colors = levels.map((level) => {
    const targetL = TAILWIND_LIGHTNESS[level]
    // Adjust chroma slightly for very light/dark shades
    let chromaMultiplier = 1
    if (level <= 100) chromaMultiplier = 0.6
    else if (level <= 200) chromaMultiplier = 0.8
    else if (level >= 900) chromaMultiplier = 0.7
    else if (level >= 800) chromaMultiplier = 0.85

    const newColor: Oklch = {
      mode: "oklch",
      l: targetL,
      c: (baseOklch.c ?? 0.1) * chromaMultiplier,
      h: baseOklch.h,
    }
    return oklchToHex(newColor)
  })

  return colors
}

/**
 * Get the closest color name from a hex color
 * @param hexColor The hex color to get the closest color name for
 * @returns The closest color name
 */
export function getClosestColorName(hexColor: string) {
  // Remove # if present and ensure uppercase
  const cleanHex = hexColor.replaceAll("#", "").toUpperCase()

  // Validate hex format
  if (!/^[0-9A-F]{6}$/.test(cleanHex)) {
    throw new Error('Invalid hex color format. Expected format: "RRGGBB" or "#RRGGBB"')
  }

  // Convert input color to HSL
  const inputHsl = hexToHsl(cleanHex)

  let closestDistance = Infinity
  let closestColorName = ""

  // Compare with each color in the list
  for (const [colorHsl, name] of HSL_COLORS_BY_NAME) {
    const hsl1 = { h: inputHsl[0], s: inputHsl[1], l: inputHsl[2] }
    const hsl2 = { h: colorHsl[0], s: colorHsl[1], l: colorHsl[2] }
    const distance = hslDistance(hsl1, hsl2)

    if (distance < closestDistance) {
      closestDistance = distance
      closestColorName = name
    }
  }

  return closestColorName
}
