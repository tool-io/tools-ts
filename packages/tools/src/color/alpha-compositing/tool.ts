import {
  formatHexColor,
  parseHexColor,
} from "../../core/color.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlphaCompositingInput = {
  readonly backdrop: string;
  readonly backdropOpacity?: number;
  readonly source: string;
  readonly sourceOpacity?: number;
};

export type AlphaCompositingOutput = {
  readonly alpha: number;
  readonly hex: string;
};

const roundOutput = (value: number): number => Number(value.toPrecision(12));

const parseColor = (value: unknown, field: string): [number, number, number] => {
  try {
    return parseHexColor(value as string);
  } catch (error) {
    if (error instanceof Error) simpleError(field, error.message, "invalid_color");
    throw error;
  }
};

export const alphaCompositingExample = {
  input: {
    backdrop: "#FFFFFF",
    backdropOpacity: 1,
    source: "#FF0000",
    sourceOpacity: 0.5,
  },
  output: { alpha: 1, hex: "#FF8080" },
} satisfies ToolExample<AlphaCompositingInput, AlphaCompositingOutput>;

export const calculateAlphaCompositing = (
  input: AlphaCompositingInput,
): AlphaCompositingOutput => {
  const source = parseColor(input.source, "source");
  const backdrop = parseColor(input.backdrop, "backdrop");
  const sourceAlpha = input.sourceOpacity ?? 1;
  const backdropAlpha = input.backdropOpacity ?? 1;
  const outputAlpha = sourceAlpha + backdropAlpha * (1 - sourceAlpha);
  const channels = outputAlpha === 0 ? [0, 0, 0] : ([0, 1, 2] as const).map(
    (channel) =>
      (source[channel]! * sourceAlpha +
        backdrop[channel]! * backdropAlpha * (1 - sourceAlpha)) /
      outputAlpha,
  );
  return {
    alpha: roundOutput(outputAlpha),
    hex: formatHexColor(channels),
  };
};

export const alphaCompositingTool = createSimpleTool({
  calculate: (input) =>
    calculateAlphaCompositing(input as unknown as AlphaCompositingInput),
  description:
    "Composite a source color over a backdrop color with straight-alpha source-over blending.",
  id: "color/alpha-compositing",
  inputs: [
    {
      description: "A three- or six-digit hexadecimal sRGB color.",
      format: "color/hex",
      id: "source",
      kind: "string",
      label: "Source color",
    },
    {
      default: 1,
      description: "Opacity of the source color between zero and one.",
      id: "sourceOpacity",
      kind: "number",
      label: "Source opacity",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "A three- or six-digit hexadecimal sRGB color.",
      format: "color/hex",
      id: "backdrop",
      kind: "string",
      label: "Backdrop color",
    },
    {
      default: 1,
      description: "Opacity of the backdrop color between zero and one.",
      id: "backdropOpacity",
      kind: "number",
      label: "Backdrop opacity",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Composite sRGB color in hexadecimal notation.",
      format: "color/hex",
      id: "hex",
      kind: "string",
      label: "Composite color",
    },
    {
      description: "Composite opacity between zero and one.",
      format: "probability",
      id: "alpha",
      kind: "number",
      label: "Composite alpha",
    },
  ],
  title: "Alpha Compositing Calculator",
});
export const runAlphaCompositing = alphaCompositingTool.execute;
export default alphaCompositingTool;
