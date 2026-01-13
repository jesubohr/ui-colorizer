import { useState, useEffect, useCallback } from "react";
import {
  contrastTone,
  tailwindPalette,
  getClosestColorName,
} from "./palette-jesus";
import { getRandomHexColor, isValidHexColor } from "./utils";

// Toast notification component
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg shadow-lg backdrop-blur-sm">
        {message}
      </div>
    </div>
  );
}

function App() {
  const [baseColor, setBaseColor] = useState(getRandomHexColor());
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
  }, []);

  // Spacebar to generate random color
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setBaseColor(getRandomHexColor());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Toast message={toast.message} visible={toast.visible} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">
            Tailwind CSS Color Generator
          </h1>
          <p className="mt-2 text-lg text-neutral-500">
            Create beautiful, consistent color palettes. Enter a color or press{" "}
            <kbd className="px-2 py-0.5 bg-neutral-200 rounded text-sm font-mono">
              Space
            </kbd>{" "}
            to generate.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            <ColorPicker baseColor={baseColor} onChange={setBaseColor} />
            <ExportPanel baseColor={baseColor} onCopy={showToast} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-10">
            <Palette baseColor={baseColor} onCopy={showToast} />
            <UIPreview baseColor={baseColor} />
          </div>
        </div>
      </div>
    </main>
  );
}

function ColorPicker({
  baseColor,
  onChange,
}: {
  baseColor: string;
  onChange: (value: string) => void;
}) {
  const [selectedColor, setSelectedColor] = useState(baseColor);
  const [textColor, setTextColor] = useState(baseColor);

  useEffect(() => {
    setSelectedColor(baseColor);
    setTextColor(baseColor);
  }, [baseColor]);

  function handlePaste(ev: React.ClipboardEvent<HTMLInputElement>) {
    ev.preventDefault();
    const pastedColor = ev.clipboardData.getData("text");
    if (isValidHexColor(pastedColor)) {
      const normalized = pastedColor.padStart(7, "#");
      setSelectedColor(normalized);
      setTextColor(normalized);
      onChange(normalized);
    }
  }

  function handleSelectedChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const color = ev.target.value;
    setSelectedColor(color);
    setTextColor(color);
    onChange(color);
  }

  function handleTextChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const color = ev.target.value;
    setTextColor(color);
    if (isValidHexColor(color) && color !== baseColor) {
      const normalized = color.padStart(7, "#");
      setSelectedColor(normalized);
      onChange(normalized);
    }
  }

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <label className="block text-sm font-medium text-neutral-600 mb-3">
        Base Color
      </label>
      <div className="relative flex items-center gap-2">
        <label
          htmlFor="color-picker"
          className="w-12 h-12 rounded-xl cursor-pointer shadow-inner border border-neutral-200 transition-transform hover:scale-105"
          style={{ backgroundColor: baseColor }}
        />
        <input
          type="color"
          id="color-picker"
          value={selectedColor}
          className="sr-only"
          onChange={handleSelectedChange}
        />
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
  );
}

function ExportPanel({
  baseColor,
  onCopy,
}: {
  baseColor: string;
  onCopy: (msg: string) => void;
}) {
  const colors = tailwindPalette(baseColor);
  const colorName = getClosestColorName(baseColor)
    .toLowerCase()
    .replace(/\s+/g, "-");
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const tailwindConfig = `'${colorName}': {\n${tones
    .map((tone, i) => `  ${tone}: '${colors[i]}'`)
    .join(",\n")}\n}`;

  const cssVariables = tones
    .map((tone, i) => `--color-${colorName}-${tone}: ${colors[i]};`)
    .join("\n");

  const [activeTab, setActiveTab] = useState<"tailwind" | "css">("tailwind");
  const [isExpanded, setIsExpanded] = useState(true);

  function handleCopy() {
    const text = activeTab === "tailwind" ? tailwindConfig : cssVariables;
    navigator.clipboard.writeText(text);
    onCopy(
      `${
        activeTab === "tailwind" ? "Tailwind config" : "CSS variables"
      } copied!`
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer focus:outline-none"
      >
        <h3 className="text-sm font-medium text-neutral-600">Export</h3>
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("tailwind");
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === "tailwind"
                    ? "bg-white shadow-sm text-neutral-800"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Tailwind
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("css");
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === "css"
                    ? "bg-white shadow-sm text-neutral-800"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                CSS
              </button>
            </div>
          </div>
          <pre className="p-4 bg-neutral-900 text-neutral-100 text-xs rounded-xl overflow-x-auto max-h-48 font-mono">
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
  );
}

function Palette({
  baseColor,
  onCopy,
}: {
  baseColor: string;
  onCopy: (msg: string) => void;
}) {
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const [colors, setColors] = useState<string[]>([]);
  const [baseColorName, setBaseColorName] = useState(
    getClosestColorName(baseColor)
  );

  useEffect(() => {
    setColors(tailwindPalette(baseColor));
    setBaseColorName(getClosestColorName(baseColor));
  }, [baseColor]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">
        {baseColorName}
      </h2>
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 xl:grid-cols-11 gap-1">
        {colors.map((color, index) => (
          <ColorSquare
            key={index}
            tone={tones[index]}
            color={color}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
}

function ColorSquare({
  tone,
  color,
  onCopy,
}: {
  tone: number;
  color: string;
  onCopy: (msg: string) => void;
}) {
  function copyColorHex() {
    navigator.clipboard.writeText(color.toLowerCase());
    onCopy(`Copied ${color.toLowerCase()}`);
  }

  return (
    <button
      onClick={copyColorHex}
      className="group flex flex-col justify-end items-center aspect-square rounded-lg transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: color }}
    >
      <span
        className="text-sm font-semibold opacity-80 group-hover:opacity-100"
        style={{ color: contrastTone(color) }}
      >
        {tone}
      </span>
      <span
        className="text-xs uppercase opacity-60 group-hover:opacity-100 mb-1"
        style={{ color: contrastTone(color) }}
      >
        {color.slice(1)}
      </span>
    </button>
  );
}

function UIPreview({ baseColor }: { baseColor: string }) {
  const colors = tailwindPalette(baseColor);
  const primary500 = colors[5];
  const primary600 = colors[6];
  const primary100 = colors[1];
  const primary700 = colors[7];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">
        Live Preview
      </h2>

      <div className="space-y-8">
        {/* Buttons */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-5 py-2.5 rounded-xl font-medium text-white transition-colors"
              style={{ backgroundColor: primary500 }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = primary600)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = primary500)
              }
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
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: primary100, color: primary700 }}
            >
              Default
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: primary500 }}
            >
              Filled
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{ borderColor: primary500, color: primary500 }}
            >
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
              This card showcases how your color palette works in context with
              real UI components.
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
  );
}

export default App;
