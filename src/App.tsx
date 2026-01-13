import { useState, useEffect } from "react"
import {
  contrastTone,
  tailwindPalette,
  getClosestColorName,
} from "./palette-jesus"
import { getRandomHexColor, isValidHexColor } from "./utils"

function App() {
  const [baseColor, setBaseColor] = useState(getRandomHexColor())

  return (
    <main className="w-full min-h-screen p-5">
      <section className="flex mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-1 py-8 px-6 border-r border-neutral-300">
          <h2 className="text-xl text-neutral-700 font-bold tracking-tight">
            Tailwind CSS Color Generator
          </h2>
          <p className="mb-3 text-lg text-neutral-500 font-medium">
            Instantly create stunning color scales by entering a base color or
            hitting the spacebar.
          </p>
          <ColorPicker baseColor={baseColor} onChange={setBaseColor} />
        </div>
        <div className="py-8 px-6 min-h-[95vh]">
          <Palette baseColor={baseColor} />
        </div>
      </section>
    </main>
  )
}

function ColorPicker({
  baseColor,
  onChange,
}: {
  baseColor: string
  onChange: (value: string) => void
}) {
  const [selectedColor, setSelectedColor] = useState(baseColor)
  const [textColor, setTextColor] = useState(baseColor)

  function handlePaste(ev: React.ClipboardEvent<HTMLInputElement>) {
    ev.preventDefault()

    /* @ts-ignore */
    const pastedColor = (ev.clipboardData || window.clipboardData).getData(
      "text"
    )
    if (isValidHexColor(pastedColor)) {
      setSelectedColor(pastedColor.padStart(7, "#"))
      setTextColor(pastedColor.padStart(7, "#"))
      onChange(pastedColor.padStart(7, "#"))
    }
  }

  function handleSelectedChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const color = ev.target.value
    setSelectedColor(color)
    setTextColor(color)
    onChange(color)
  }

  function handleTextChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const color = ev.target.value
    setTextColor(color)
    if (isValidHexColor(color) && color !== baseColor) {
      setSelectedColor(color.padStart(7, "#"))
      onChange(color.padStart(7, "#"))
    }
  }

  return (
    <div className="relative flex items-center gap-1 w-full md:w-100 border border-neutral-300 rounded-xl has-focus-visible:border-neutral-800 has-focus-visible:ring-1 has-focus-visible:ring-offset-neutral-800">
      <label
        htmlFor="color-picker"
        className="absolute left-3.5 block pb-2 w-5 h-5 rounded-full cursor-pointer"
        style={{ backgroundColor: baseColor }}
      />
      <input
        type="color"
        id="color-picker"
        value={selectedColor}
        className="invisible pointer-events-none w-0 h-0"
        onChange={handleSelectedChange}
      />
      <input
        type="text"
        className="py-3 pl-10 pr-4 w-full h-full focus:outline-none"
        value={textColor}
        onChange={handleTextChange}
        onPaste={handlePaste}
      />
    </div>
  )
}

function Palette({ baseColor }: { baseColor: string }) {
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const [colors, setColors] = useState<string[]>([])
  const [baseColorName, setBaseColorName] = useState(
    getClosestColorName(baseColor)
  )

  useEffect(() => {
    const colors = tailwindPalette(baseColor)
    setColors(colors)
    setBaseColorName(getClosestColorName(baseColor))
  }, [baseColor])

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-neutral-700 text-xl font-semibold">
        {baseColorName}
      </h2>
      <div className="flex items-center justify-center gap-1 w-full">
        {colors.map((color, index) => (
          <ColorSquare key={index} tone={tones[index]} color={color} />
        ))}
      </div>
    </div>
  )
}

function ColorSquare({ tone, color }: { tone: number; color: string }) {
  function copyColorHex() {
    navigator.clipboard.writeText(color.toLowerCase())
    alert(`${color.toLowerCase()} copied to clipboard`)
  }

  return (
    <div
      className="flex flex-col justify-end items-center py-4 px-2 w-[84px] h-24 rounded-lg"
      style={{ backgroundColor: color }}
    >
      <button
        className="flex flex-col items-center p-1 cursor-pointer"
        onClick={copyColorHex}
      >
        <span
          className="uppercase font-medium text-sm"
          style={{ color: contrastTone(color) }}
        >
          {tone}
        </span>
        <span
          className="uppercase text-xs"
          style={{ color: contrastTone(color) }}
        >
          {color.slice(1)}
        </span>
      </button>
    </div>
  )
}

export default App
