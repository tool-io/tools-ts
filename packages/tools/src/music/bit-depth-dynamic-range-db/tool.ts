import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BitDepthDynamicRangeDbInput = Readonly<{
  readonly bitDepth: number;
}>;
export type BitDepthDynamicRangeDbOutput = Readonly<{
  readonly idealSqnrDecibels: number;
}>;

export const calculateBitDepthDynamicRangeDb = (
  x: BitDepthDynamicRangeDbInput,
): BitDepthDynamicRangeDbOutput => {
  if (
    !Number.isFinite(x.bitDepth) ||
    !Number.isSafeInteger(x.bitDepth) ||
    x.bitDepth < 1
  )
    simpleError("bitDepth", "Provide a positive safe integer.");
  const idealSqnrDecibels = 6.020599913279624 * x.bitDepth + 1.7609125905568124;
  if (!Number.isFinite(idealSqnrDecibels))
    simpleError(
      "idealSqnrDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    idealSqnrDecibels: Object.is(idealSqnrDecibels, -0) ? 0 : idealSqnrDecibels,
  };
};

export const example = {
  input: {
    bitDepth: 16,
  },
  output: { idealSqnrDecibels: 98.0905112030308 },
} satisfies ToolExample<
  BitDepthDynamicRangeDbInput,
  BitDepthDynamicRangeDbOutput
>;

export const tool = createSimpleTool({
  id: "music/bit-depth-dynamic-range-db",
  title: "Bit Depth Dynamic Range Db",
  description:
    "Ideal full-scale sine-wave quantization signal-to-noise ratio in dB, approximately 6.02N+1.76 for N-bit PCM.",
  inputs: [
    {
      id: "bitDepth",
      kind: "integer",
      label: "Bit Depth",
      unit: "bit",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "idealSqnrDecibels",
      kind: "number",
      label: "Ideal Sqnr Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateBitDepthDynamicRangeDb({
      bitDepth: input.bitDepth as number,
    }),
});
export const bitDepthDynamicRangeDbTool = tool;
export const runBitDepthDynamicRangeDb = tool.execute;
export default tool;
