import { useState, useEffect } from "react"
import { isValidHexColor } from "@/lib/utils"
import type { ColorScale } from "@/types"

export default function ColorPicker({
  colorScale,
  onChange,
  onNameChange,
}: {
  colorScale: ColorScale
  onChange: (value: string) => void
  onNameChange: (name: string) => void
}) {
  const [selectedColor, setSelectedColor] = useState(colorScale.baseColor)
  const [textColor, setTextColor] = useState(colorScale.baseColor)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(colorScale.name)

  useEffect(() => {
    setSelectedColor(colorScale.baseColor)
    setTextColor(colorScale.baseColor)
  }, [colorScale.baseColor])

  useEffect(() => {
    setEditedName(colorScale.name)
  }, [colorScale.name])

  function handlePaste(ev: React.ClipboardEvent<HTMLInputElement>) {
    ev.preventDefault()
    const pastedColor = ev.clipboardData.getData("text")
    if (isValidHexColor(pastedColor)) {
      const normalized = pastedColor.padStart(7, "#")
      setSelectedColor(normalized)
      setTextColor(normalized)
      onChange(normalized)
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
    if (isValidHexColor(color) && color !== colorScale.baseColor) {
      const normalized = color.padStart(7, "#")
      setSelectedColor(normalized)
      onChange(normalized)
    }
  }

  function handleNameSubmit() {
    if (editedName.trim()) {
      onNameChange(editedName.trim())
    } else {
      setEditedName(colorScale.name)
    }
    setIsEditingName(false)
  }

  const pickerId = `color-picker-${colorScale.id}`

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-3">
        {isEditingName ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            className="text-sm font-medium text-neutral-600 bg-neutral-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-800 cursor-pointer flex items-center gap-1"
          >
            {colorScale.name}
            <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className="relative flex items-center gap-2">
        <label
          htmlFor={pickerId}
          className="w-12 h-12 rounded-xl cursor-pointer shadow-inner border border-neutral-200 transition-transform hover:scale-105"
          style={{ backgroundColor: colorScale.baseColor }}
        />
        <input type="color" id={pickerId} value={selectedColor} className="sr-only" onChange={handleSelectedChange} />
        <input
          type="text"
          className="flex-1 py-3 px-4 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          value={textColor}
          onChange={handleTextChange}
          onPaste={handlePaste}
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
