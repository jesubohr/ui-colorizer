import { contrastTone } from "@/lib/palette"

export default function ColorSquare({ tone, color, onCopy }: { tone: number; color: string; onCopy: (msg: string) => void }) {
  function copyColorHex() {
    navigator.clipboard.writeText(color.toLowerCase())
    onCopy(`Copied ${color.toLowerCase()}`)
  }

  return (
    <button
      onClick={copyColorHex}
      className="group flex flex-col justify-end items-center aspect-square rounded-lg transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: color }}
    >
      <span className="text-sm font-semibold opacity-80 group-hover:opacity-100" style={{ color: contrastTone(color) }}>
        {tone}
      </span>
      <span className="text-xs uppercase opacity-60 group-hover:opacity-100 mb-1" style={{ color: contrastTone(color) }}>
        {color.slice(1)}
      </span>
    </button>
  )
}
