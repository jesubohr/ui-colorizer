import { useState, useEffect, useCallback } from "react";
import { contrastTone, tailwindPalette } from "./palette-jesus";
import { getRandomHexColor, isValidHexColor } from "./utils";

// Types
interface ColorScale {
  id: string;
  name: string;
  baseColor: string;
}

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

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Helper to create a new color scale
function createColorScale(baseColor?: string): ColorScale {
  const color = baseColor || getRandomHexColor();
  return {
    id: generateId(),
    name: "Primary",
    baseColor: color,
  };
}

function App() {
  const [colorScales, setColorScales] = useState<ColorScale[]>([
    createColorScale(),
  ]);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
  }, []);

  // Spacebar to generate random color for the first (primary) scale
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setColorScales((scales) =>
          scales.map((scale, index) =>
            index === 0 ? { ...scale, baseColor: getRandomHexColor() } : scale
          )
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleColorChange = (id: string, newColor: string) => {
    setColorScales((scales) =>
      scales.map((scale) =>
        scale.id === id ? { ...scale, baseColor: newColor } : scale
      )
    );
  };

  const handleNameChange = (id: string, newName: string) => {
    setColorScales((scales) =>
      scales.map((scale) =>
        scale.id === id ? { ...scale, name: newName } : scale
      )
    );
  };

  const handleGenerateRandom = (id: string) => {
    setColorScales((scales) =>
      scales.map((scale) =>
        scale.id === id ? { ...scale, baseColor: getRandomHexColor() } : scale
      )
    );
  };

  const handleAddColorScale = () => {
    const scaleNames = [
      "Secondary",
      "Tertiary",
      "Accent",
      "Neutral",
      "Success",
      "Warning",
      "Error",
    ];
    const usedNames = new Set(colorScales.map((s) => s.name));
    const nextName =
      scaleNames.find((n) => !usedNames.has(n)) ||
      `Custom ${colorScales.length + 1}`;

    setColorScales((scales) => [
      ...scales,
      { ...createColorScale(), name: nextName },
    ]);
  };

  const handleRemoveColorScale = (id: string) => {
    if (colorScales.length > 1) {
      setColorScales((scales) => scales.filter((scale) => scale.id !== id));
    }
  };

  // Use the first color scale for UI preview
  const primaryScale = colorScales[0];

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
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
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
                onRemove={
                  colorScales.length > 1
                    ? () => handleRemoveColorScale(scale.id)
                    : undefined
                }
                showControls={index > 0}
              />
            ))}

            <UIPreview baseColor={primaryScale.baseColor} />
          </div>
        </div>
      </div>
    </main>
  );
}

function ColorPicker({
  colorScale,
  onChange,
  onNameChange,
}: {
  colorScale: ColorScale;
  onChange: (value: string) => void;
  onNameChange: (name: string) => void;
}) {
  const [selectedColor, setSelectedColor] = useState(colorScale.baseColor);
  const [textColor, setTextColor] = useState(colorScale.baseColor);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(colorScale.name);

  useEffect(() => {
    setSelectedColor(colorScale.baseColor);
    setTextColor(colorScale.baseColor);
  }, [colorScale.baseColor]);

  useEffect(() => {
    setEditedName(colorScale.name);
  }, [colorScale.name]);

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
    if (isValidHexColor(color) && color !== colorScale.baseColor) {
      const normalized = color.padStart(7, "#");
      setSelectedColor(normalized);
      onChange(normalized);
    }
  }

  function handleNameSubmit() {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
    } else {
      setEditedName(colorScale.name);
    }
    setIsEditingName(false);
  }

  const pickerId = `color-picker-${colorScale.id}`;

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
            <svg
              className="w-3 h-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
        <input
          type="color"
          id={pickerId}
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
  colorScales,
  onCopy,
}: {
  colorScales: ColorScale[];
  onCopy: (msg: string) => void;
}) {
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Generate config for all color scales
  const tailwindConfig = colorScales
    .map((scale) => {
      const colors = tailwindPalette(scale.baseColor);
      const colorName = scale.name.toLowerCase().replace(/\s+/g, "-");
      return `'${colorName}': {\n${tones
        .map((tone, i) => `  ${tone}: '${colors[i]}'`)
        .join(",\n")}\n}`;
    })
    .join(",\n");

  const cssVariables = colorScales
    .map((scale) => {
      const colors = tailwindPalette(scale.baseColor);
      const colorName = scale.name.toLowerCase().replace(/\s+/g, "-");
      return tones
        .map((tone, i) => `--color-${colorName}-${tone}: ${colors[i]};`)
        .join("\n");
    })
    .join("\n\n");

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
        <h3 className="text-sm font-medium text-neutral-600">
          Export ({colorScales.length}{" "}
          {colorScales.length === 1 ? "scale" : "scales"})
        </h3>
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
  );
}

function Palette({
  colorScale,
  onCopy,
  onColorChange,
  onNameChange,
  onGenerateRandom,
  onRemove,
  showControls,
}: {
  colorScale: ColorScale;
  onCopy: (msg: string) => void;
  onColorChange: (color: string) => void;
  onNameChange: (name: string) => void;
  onGenerateRandom: () => void;
  onRemove?: () => void;
  showControls: boolean;
}) {
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const [colors, setColors] = useState<string[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(colorScale.name);

  useEffect(() => {
    setColors(tailwindPalette(colorScale.baseColor));
  }, [colorScale.baseColor]);

  useEffect(() => {
    setEditedName(colorScale.name);
  }, [colorScale.name]);

  function handleNameSubmit() {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
    } else {
      setEditedName(colorScale.name);
    }
    setIsEditingName(false);
  }

  const pickerId = `palette-picker-${colorScale.id}`;

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
              <input
                type="color"
                id={pickerId}
                value={colorScale.baseColor}
                className="sr-only"
                onChange={(e) => onColorChange(e.target.value)}
              />
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
              <svg
                className="w-4 h-4 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
              <svg
                className="w-4 h-4"
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
            </button>

            {/* Remove this scale */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                title="Remove color scale"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
