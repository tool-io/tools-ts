import { parseHexColor, formatHexColor } from "../../core/color.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlendInput = {
  readonly amount?: number;
  readonly from: string;
  readonly to: string;
};

export type BlendOutput = {
  readonly hex: string;
};

const parseColor = (value: unknown, field: string): [number, number, number] => {
  try {
    return parseHexColor(value as string);
  } catch (error) {
    if (error instanceof Error) simpleError(field, error.message, "invalid_color");
    throw error;
  }
};

export const blendExample = {
  input: { amount: 0.5, from: "#000000", to: "#FFFFFF" },
  output: { hex: "#808080" },
} satisfies ToolExample<BlendInput, BlendOutput>;

export const calculateBlend = (input: BlendInput): BlendOutput => {
  const from = parseColor(input.from, "from");
  const to = parseColor(input.to, "to");
  const amount = input.amount ?? 0.5;
  return {
    hex: formatHexColor(
      from.map((channel, index) => channel + (to[index]! - channel) * amount),
    ),
  };
};

export const blendTool = createSimpleTool({
  calculate: (input) => calculateBlend(input as unknown as BlendInput),
  description:
    "Blend two hexadecimal sRGB colors by interpolating their channels.",
  id: "color/blend",
  inputs: [
    {
      description: "A three- or six-digit hexadecimal sRGB color.",
      format: "color/hex",
      id: "from",
      kind: "string",
      label: "Start color",
    },
    {
      description: "A three- or six-digit hexadecimal sRGB color.",
      format: "color/hex",
      id: "to",
      kind: "string",
      label: "End color",
    },
    {
      default: 0.5,
      description:
        "Blend position between the colors; zero returns the start color and one the end color.",
      id: "amount",
      kind: "number",
      label: "Amount",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Blended sRGB color in hexadecimal notation.",
      format: "color/hex",
      id: "hex",
      kind: "string",
      label: "Blended color",
    },
  ],
  title: "Color Blend Calculator",
});
export const runBlend = blendTool.execute;
export default blendTool;
