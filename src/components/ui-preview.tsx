import { tailwindPalette } from "@/lib/palette"
import type { ColorScale } from "@/types"

type ColorPalette = {
  c50: string
  c100: string
  c200: string
  c300: string
  c400: string
  c500: string
  c600: string
  c700: string
  c800: string
  c900: string
  c950: string
}

function getPalette(baseColor: string): ColorPalette {
  const colors = tailwindPalette(baseColor)
  return {
    c50: colors[0],
    c100: colors[1],
    c200: colors[2],
    c300: colors[3],
    c400: colors[4],
    c500: colors[5],
    c600: colors[6],
    c700: colors[7],
    c800: colors[8],
    c900: colors[9],
    c950: colors[10],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ButtonsPreview({
  primaryName,
  secondaryName,
  primary,
  secondary,
}: {
  primaryName: string
  secondaryName: string
  primary: ColorPalette
  secondary: ColorPalette
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">
        Buttons ({primaryName} & {secondaryName})
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          className="px-5 py-2.5 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: primary.c500 }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = primary.c600)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primary.c500)}
        >
          {primaryName} Button
        </button>
        <button
          className="px-5 py-2.5 rounded-xl font-medium transition-colors"
          style={{
            backgroundColor: secondary.c100,
            color: secondary.c700,
          }}
        >
          {secondaryName} Button
        </button>
        <button
          className="px-5 py-2.5 rounded-xl font-medium border-2 transition-colors"
          style={{
            borderColor: primary.c500,
            color: primary.c500,
          }}
        >
          Outline Button
        </button>
      </div>
    </div>
  )
}

function BadgesPreview({ accentName, accent }: { accentName: string; accent: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Badges ({accentName})</h3>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: accent.c100, color: accent.c700 }}>
          Default
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: accent.c500 }}>
          Filled
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium border" style={{ borderColor: accent.c500, color: accent.c500 }}>
          Outline
        </span>
      </div>
    </div>
  )
}

function CardPreview({ primaryName, primary }: { primaryName: string; primary: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Card ({primaryName})</h3>
      <div
        className="p-5 rounded-xl border-l-4"
        style={{
          backgroundColor: primary.c100,
          borderLeftColor: primary.c500,
        }}
      >
        <h4 className="font-semibold mb-1" style={{ color: primary.c700 }}>
          Feature Highlight
        </h4>
        <p className="text-sm" style={{ color: primary.c600 }}>
          This card showcases how your {primaryName} palette works in context with real UI components.
        </p>
      </div>
    </div>
  )
}

function InputPreview({ primary }: { primary: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Input</h3>
      <input
        type="text"
        placeholder="Type something..."
        className="w-full max-w-sm px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none"
        style={{
          borderColor: primary.c500,
        }}
      />
    </div>
  )
}

function AlertsPreview({ primary, secondary }: { primary: ColorPalette; secondary: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Alerts</h3>
      <div className="space-y-3">
        <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: primary.c50, borderLeft: `4px solid ${primary.c500}` }}>
          <svg className="w-5 h-5 mt-0.5 shrink-0" style={{ color: primary.c500 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <div>
            <p className="font-medium text-sm" style={{ color: primary.c800 }}>
              Information
            </p>
            <p className="text-xs mt-0.5" style={{ color: primary.c600 }}>
              This is an informational alert message.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: secondary.c50, borderLeft: `4px solid ${secondary.c500}` }}>
          <svg className="w-5 h-5 mt-0.5 shrink-0" style={{ color: secondary.c500 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium text-sm" style={{ color: secondary.c800 }}>
              Success
            </p>
            <p className="text-xs mt-0.5" style={{ color: secondary.c600 }}>
              Your action was completed successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressPreview({ primary, secondary }: { primary: ColorPalette; secondary: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Progress Bars</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: primary.c700 }}>Primary Progress</span>
            <span style={{ color: primary.c500 }}>75%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: primary.c100 }}>
            <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: primary.c500 }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: secondary.c700 }}>Secondary Progress</span>
            <span style={{ color: secondary.c500 }}>50%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: secondary.c100 }}>
            <div className="h-full w-1/2 rounded-full" style={{ backgroundColor: secondary.c500 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AvatarsPreview({ primary, accent }: { primary: ColorPalette; accent: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Avatars</h3>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
          style={{ backgroundColor: primary.c100, color: primary.c700 }}
        >
          AB
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white"
          style={{ backgroundColor: primary.c500 }}
        >
          CD
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
          style={{ backgroundColor: accent.c100, color: accent.c700 }}
        >
          EF
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white"
          style={{ backgroundColor: accent.c500 }}
        >
          GH
        </div>
      </div>
    </div>
  )
}

function ToggleSwitchPreview({ primary }: { primary: ColorPalette }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-3">Toggle Switch</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-11 h-6 rounded-full cursor-pointer" style={{ backgroundColor: primary.c500 }}>
          <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform" />
        </div>
        <span className="text-sm" style={{ color: primary.c700 }}>
          Enabled
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function UIPreview({ colorScales }: { colorScales: ColorScale[] }) {
  const primaryScale = colorScales[0]
  const secondaryScale = colorScales[1] || primaryScale
  const accentScale = colorScales[2] || secondaryScale

  const primary = getPalette(primaryScale.baseColor)
  const secondary = getPalette(secondaryScale.baseColor)
  const accent = getPalette(accentScale.baseColor)

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">Live Preview</h2>

      <div className="space-y-8">
        <ButtonsPreview primaryName={primaryScale.name} secondaryName={secondaryScale.name} primary={primary} secondary={secondary} />
        <BadgesPreview accentName={accentScale.name} accent={accent} />
        <CardPreview primaryName={primaryScale.name} primary={primary} />
        <InputPreview primary={primary} />
        <AlertsPreview primary={primary} secondary={secondary} />
        <ProgressPreview primary={primary} secondary={secondary} />
        <AvatarsPreview primary={primary} accent={accent} />
        <ToggleSwitchPreview primary={primary} />
      </div>
    </div>
  )
}
