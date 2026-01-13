import { useEffect, useState } from "react"
import { tailwindPalette } from "@/palette-jesus"
import ColorSquare from "./colors-square"
import type { ColorScale } from "@/types"

export default function Palette({
  colorScale,
  onCopy,
  onColorChange,
  onNameChange,
  onGenerateRandom,
  onRemove,
  showControls,
}: {
  colorScale: ColorScale
  onCopy: (msg: string) => void
  onColorChange: (color: string) => void
  onNameChange: (name: string) => void
  onGenerateRandom: () => void
  onRemove?: () => void
  showControls: boolean
}) {
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const [colors, setColors] = useState<string[]>([])
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(colorScale.name)

  useEffect(() => {
    setColors(tailwindPalette(colorScale.baseColor))
  }, [colorScale.baseColor])

  useEffect(() => {
    setEditedName(colorScale.name)
  }, [colorScale.name])

  function handleNameSubmit() {
    if (editedName.trim()) {
      onNameChange(editedName.trim())
    } else {
      setEditedName(colorScale.name)
    }
    setIsEditingName(false)
  }

  const pickerId = `palette-picker-${colorScale.id}`

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {showControls && (
            <>
              <label
                htmlFor={pickerId}
                className="w-8 h-8 rounded-lg cursor-pointer shadow-inner border border-neutral-200 transition-transform hover:scale-105"
                style={{ backgroundColor: colorScale.baseColor }}
              />
              <input type="color" id={pickerId} value={colorScale.baseColor} className="sr-only" onChange={(e) => onColorChange(e.target.value)} />
            </>
          )}
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              className="text-xl font-semibold text-neutral-800 bg-neutral-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-xl font-semibold text-neutral-800 hover:text-neutral-600 cursor-pointer flex items-center gap-2"
            >
              {colorScale.name}
              <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            {/* Generate Random for this scale */}
            <button
              onClick={onGenerateRandom}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              title="Generate random color"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Remove this scale */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                title="Remove color scale"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 xl:grid-cols-11 gap-1">
        {colors.map((color, index) => (
          <ColorSquare key={index} tone={tones[index]} color={color} onCopy={onCopy} />
        ))}
      </div>
    </div>
  )
}
