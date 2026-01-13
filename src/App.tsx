import { useState, useEffect, useCallback } from "react"
import { getRandomHexColor, createColorScale } from "@/lib/utils"
import type { ColorScale } from "@/types"

import Toast from "@/components/ui/toast"
import ColorPicker from "@/components/color-picker"
import ExportPanel from "@/components/export-panel"
import Palette from "@/components/palette"
import UIPreview from "@/components/ui-preview"

function App() {
  const [colorScales, setColorScales] = useState<ColorScale[]>([createColorScale()])
  const [toast, setToast] = useState({ message: "", visible: false })

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000)
  }, [])

  // Spacebar to generate random color for the first (primary) scale
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        setColorScales((scales) => scales.map((scale, index) => (index === 0 ? { ...scale, baseColor: getRandomHexColor() } : scale)))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleColorChange = (id: string, newColor: string) => {
    setColorScales((scales) => scales.map((scale) => (scale.id === id ? { ...scale, baseColor: newColor } : scale)))
  }

  const handleNameChange = (id: string, newName: string) => {
    setColorScales((scales) => scales.map((scale) => (scale.id === id ? { ...scale, name: newName } : scale)))
  }

  const handleGenerateRandom = (id: string) => {
    setColorScales((scales) => scales.map((scale) => (scale.id === id ? { ...scale, baseColor: getRandomHexColor() } : scale)))
  }

  const handleAddColorScale = () => {
    const scaleNames = ["Secondary", "Tertiary", "Accent", "Neutral", "Success", "Warning", "Error"]
    const usedNames = new Set(colorScales.map((s) => s.name))
    const nextName = scaleNames.find((n) => !usedNames.has(n)) || `Custom ${colorScales.length + 1}`

    setColorScales((scales) => [...scales, { ...createColorScale(), name: nextName }])
  }

  const handleRemoveColorScale = (id: string) => {
    if (colorScales.length > 1) {
      setColorScales((scales) => scales.filter((scale) => scale.id !== id))
    }
  }

  // Use the first color scale for UI preview
  const primaryScale = colorScales[0]

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Toast message={toast.message} visible={toast.visible} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Tailwind CSS Color Generator</h1>
          <p className="mt-2 text-lg text-neutral-500">
            Create beautiful, consistent color palettes. Enter a color or press{" "}
            <kbd className="px-2 py-0.5 bg-neutral-200 rounded text-sm font-mono">Space</kbd> to generate.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            <ColorPicker
              colorScale={colorScales[0]}
              onChange={(color) => handleColorChange(colorScales[0].id, color)}
              onNameChange={(name) => handleNameChange(colorScales[0].id, name)}
            />

            {/* Generate Random Button */}
            <button
              onClick={() => handleGenerateRandom(colorScales[0].id)}
              className="w-full py-3 px-4 bg-white border-2 border-neutral-200 rounded-xl font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-neutral-500 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Generate random
            </button>

            {/* Add Secondary Color Scale Button */}
            <button
              onClick={handleAddColorScale}
              className="w-full py-3 px-4 bg-neutral-800 rounded-xl font-medium text-white hover:bg-neutral-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add secondary color scale
            </button>

            <ExportPanel colorScales={colorScales} onCopy={showToast} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* All Color Palettes */}
            {colorScales.map((scale, index) => (
              <Palette
                key={scale.id}
                colorScale={scale}
                onCopy={showToast}
                onColorChange={(color) => handleColorChange(scale.id, color)}
                onNameChange={(name) => handleNameChange(scale.id, name)}
                onGenerateRandom={() => handleGenerateRandom(scale.id)}
                onRemove={colorScales.length > 1 ? () => handleRemoveColorScale(scale.id) : undefined}
                showControls={index > 0}
              />
            ))}

            <UIPreview baseColor={primaryScale.baseColor} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
