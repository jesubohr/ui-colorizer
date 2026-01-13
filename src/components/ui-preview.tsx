import { tailwindPalette } from "@/lib/palette"

export default function UIPreview({ baseColor }: { baseColor: string }) {
  const colors = tailwindPalette(baseColor)
  const primary500 = colors[5]
  const primary600 = colors[6]
  const primary100 = colors[1]
  const primary700 = colors[7]

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">Live Preview</h2>

      <div className="space-y-8">
        {/* Buttons */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-white transition-colors"
              style={{ backgroundColor: primary500 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = primary600)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primary500)}
            >
              Primary Button
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium transition-colors"
              style={{
                backgroundColor: primary100,
                color: primary700,
              }}
            >
              Secondary Button
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors"
              style={{
                borderColor: primary500,
                color: primary500,
              }}
            >
              Outline Button
            </button>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: primary100, color: primary700 }}>
              Default
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: primary500 }}>
              Filled
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium border" style={{ borderColor: primary500, color: primary500 }}>
              Outline
            </span>
          </div>
        </div>

        {/* Card */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Card</h3>
          <div
            className="p-5 rounded-xl border-l-4"
            style={{
              backgroundColor: primary100,
              borderLeftColor: primary500,
            }}
          >
            <h4 className="font-semibold mb-1" style={{ color: primary700 }}>
              Feature Highlight
            </h4>
            <p className="text-sm" style={{ color: primary600 }}>
              This card showcases how your color palette works in context with real UI components.
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
              borderColor: primary500,
            }}
          />
        </div>
      </div>
    </div>
  )
}
