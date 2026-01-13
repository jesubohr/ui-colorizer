import { useState } from "react"
import { tailwindPalette } from "@/palette-jesus"
import type { ColorScale } from "@/types"

export default function ExportPanel({ colorScales, onCopy }: { colorScales: ColorScale[]; onCopy: (msg: string) => void }) {
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  // Generate config for all color scales
  const tailwindConfig = colorScales
    .map((scale) => {
      const colors = tailwindPalette(scale.baseColor)
      const colorName = scale.name.toLowerCase().replace(/\s+/g, "-")
      return `'${colorName}': {\n${tones.map((tone, i) => `  ${tone}: '${colors[i]}'`).join(",\n")}\n}`
    })
    .join(",\n")

  const cssVariables = colorScales
    .map((scale) => {
      const colors = tailwindPalette(scale.baseColor)
      const colorName = scale.name.toLowerCase().replace(/\s+/g, "-")
      return tones.map((tone, i) => `--color-${colorName}-${tone}: ${colors[i]};`).join("\n")
    })
    .join("\n\n")

  const [activeTab, setActiveTab] = useState<"tailwind" | "css">("tailwind")
  const [isExpanded, setIsExpanded] = useState(true)

  function handleCopy() {
    const text = activeTab === "tailwind" ? tailwindConfig : cssVariables
    navigator.clipboard.writeText(text)
    onCopy(`${activeTab === "tailwind" ? "Tailwind config" : "CSS variables"} copied!`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer focus:outline-none"
      >
        <h3 className="text-sm font-medium text-neutral-600">
          Export ({colorScales.length} {colorScales.length === 1 ? "scale" : "scales"})
        </h3>
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab("tailwind")
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === "tailwind" ? "bg-white shadow-sm text-neutral-800" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Tailwind
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab("css")
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === "css" ? "bg-white shadow-sm text-neutral-800" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                CSS
              </button>
            </div>
          </div>
          <pre className="p-4 bg-neutral-900 text-neutral-100 text-xs rounded-xl overflow-x-auto max-h-64 font-mono">
            {activeTab === "tailwind" ? tailwindConfig : cssVariables}
          </pre>
          <button
            onClick={handleCopy}
            className="mt-4 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  )
}
