import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeltaE76Input = {
  readonly colorA: string;
  readonly colorB: string;
};

export type DeltaE76Output = {
  readonly deltaE76: number;
  readonly labA: readonly number[];
  readonly labB: readonly number[];
};

export const calculateDeltaE76 = (input: DeltaE76Input): DeltaE76Output => {
  const parseHex = (hex: string, field: string): number[] => {
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex))
      simpleError(field, "Enter a hex color such as #RRGGBB.", "invalid_color");
    const digits = hex.slice(1);
    const full =
      digits.length === 3
        ? [...digits].map((c: string) => c + c).join("")
        : digits;
    return [0, 2, 4].map((offset: number) =>
      parseInt(full.slice(offset, offset + 2), 16),
    );
  };
  const srgbToLab = (rgb: number[]): number[] => {
    const [r, g, b] = rgb.map((channel: number): number => {
      const c = channel / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;
    const f = (t: number): number =>
      t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116;
    const fx = f(x);
    const fy = f(y);
    const fz = f(z);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  };
  const labA = srgbToLab(parseHex(input.colorA, "colorA"));
  const labB = srgbToLab(parseHex(input.colorB, "colorB"));
  return {
    deltaE76: Math.sqrt(
      (labA[0]! - labB[0]!) ** 2 +
        (labA[1]! - labB[1]!) ** 2 +
        (labA[2]! - labB[2]!) ** 2,
    ),
    labA,
    labB,
  };
};

export const deltaE76Example = {
  input: {
    colorA: "#ff0000",
    colorB: "#0000ff",
  },
  output: {
    deltaE76: 176.3140390888004,
    labA: [53.240794141307205, 80.09245959641115, 67.20319651585298],
    labB: [32.297010932850725, 79.18751984512224, -107.8601617541481],
  },
} satisfies ToolExample<DeltaE76Input, DeltaE76Output>;

export const deltaE76Tool = createSimpleTool({
  id: "color/delta-e-76",
  title: "Delta E 76 Color Difference",
  description:
    "Compute the CIE76 (Delta E 1976) difference between two sRGB hex colors via CIELAB.",
  inputs: [
    {
      description: "First hex color, #RGB or #RRGGBB.",
      id: "colorA",
      kind: "string",
      label: "Color A",
    },
    {
      description: "Second hex color, #RGB or #RRGGBB.",
      id: "colorB",
      kind: "string",
      label: "Color B",
    },
  ],
  outputs: [
    {
      description: "Euclidean distance between the CIELAB colors.",
      id: "deltaE76",
      kind: "number",
      label: "Delta E 76",
    },
    {
      description: "CIELAB coordinates of color A.",
      id: "labA",
      kind: "numberList",
      label: "Lab A",
    },
    {
      description: "CIELAB coordinates of color B.",
      id: "labB",
      kind: "numberList",
      label: "Lab B",
    },
  ],
  calculate: (input) =>
    calculateDeltaE76({
      colorA: input.colorA as string,
      colorB: input.colorB as string,
    }),
});

export const runDeltaE76 = deltaE76Tool.execute;
export default deltaE76Tool;
