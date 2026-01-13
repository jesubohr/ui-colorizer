import { tailwindPalette } from "@/lib/palette"
import type { ColorScale } from "@/types"

export default function UIPreview({ colorScales }: { colorScales: ColorScale[] }) {
  const primaryScale = colorScales[0]
  const secondaryScale = colorScales[1] || primaryScale
  const accentScale = colorScales[2] || secondaryScale

  const primaryColors = tailwindPalette(primaryScale.baseColor)
  const secondaryColors = tailwindPalette(secondaryScale.baseColor)
  const accentColors = tailwindPalette(accentScale.baseColor)

  const p500 = primaryColors[5]
  const p600 = primaryColors[6]
  const p100 = primaryColors[1]
  const p700 = primaryColors[7]

  const s100 = secondaryColors[1]
  const s700 = secondaryColors[7]

  const a500 = accentColors[5]
  const a100 = accentColors[1]
  const a700 = accentColors[7]

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">Live Preview</h2>

      <div className="space-y-8">
        {/* Buttons */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">
            Buttons ({primaryScale.name} & {secondaryScale.name})
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-white transition-colors"
              style={{ backgroundColor: p500 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = p600)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = p500)}
            >
              {primaryScale.name} Button
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium transition-colors"
              style={{
                backgroundColor: s100,
                color: s700,
              }}
            >
              {secondaryScale.name} Button
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors"
              style={{
                borderColor: p500,
                color: p500,
              }}
            >
              Outline Button
            </button>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Badges ({accentScale.name})</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: a100, color: a700 }}>
              Default
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: a500 }}>
              Filled
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium border" style={{ borderColor: a500, color: a500 }}>
              Outline
            </span>
          </div>
        </div>

        {/* Card */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Card ({primaryScale.name})</h3>
          <div
            className="p-5 rounded-xl border-l-4"
            style={{
              backgroundColor: p100,
              borderLeftColor: p500,
            }}
          >
            <h4 className="font-semibold mb-1" style={{ color: p700 }}>
              Feature Highlight
            </h4>
            <p className="text-sm" style={{ color: p600 }}>
              This card showcases how your {primaryScale.name} palette works in context with real UI components.
            </p>
          </div>
        </div>

        {/* Input */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Input</h3>
          <input
            type="text"
            placeholder="Type something..."
            className="w-full max-w-sm px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
            style={{
              borderColor: p500,
            }}
          />
        </div>
      </div>
    </div>
  )
}
