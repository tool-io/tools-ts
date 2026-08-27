import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompressionIndexInput = {
  readonly voidRatioStart: number;
  readonly voidRatioEnd: number;
  readonly effectiveStressStartKpa: number;
  readonly effectiveStressEndKpa: number;
};

export type CompressionIndexOutput = {
  readonly compressionIndex: number;
};

export const calculateCompressionIndex = (
  input: CompressionIndexInput,
): CompressionIndexOutput => {
  if (
    !(input.effectiveStressStartKpa > 0) ||
    !(input.effectiveStressEndKpa > 0)
  )
    simpleError(
      "effectiveStressStartKpa",
      "Effective stresses must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.effectiveStressEndKpa > input.effectiveStressStartKpa))
    simpleError(
      "effectiveStressEndKpa",
      "End stress must exceed the start stress on the virgin compression line.",
      "invalid_stress",
    );
  if (!(input.voidRatioStart >= 0) || !(input.voidRatioEnd >= 0))
    simpleError(
      "voidRatioStart",
      "Void ratios must be non-negative.",
      "invalid_void_ratio",
    );
  return {
    compressionIndex:
      (input.voidRatioStart - input.voidRatioEnd) /
      Math.log10(input.effectiveStressEndKpa / input.effectiveStressStartKpa),
  };
};

export const compressionIndexExample = {
  input: {
    voidRatioStart: 1.2,
    voidRatioEnd: 1.0,
    effectiveStressStartKpa: 100,
    effectiveStressEndKpa: 200,
  },
  output: { compressionIndex: 0.6643856189774723 },
} satisfies ToolExample<CompressionIndexInput, CompressionIndexOutput>;

export const compressionIndexTool = createSimpleTool({
  id: "geology/compression-index",
  title: "Compression Index Calculator",
  description:
    "Compression index Cc = -(de) / d(log10 sigma') = (e1 - e2) / log10(sigma2' / sigma1') from two points on the virgin consolidation curve. Void ratios dimensionless, effective stresses in kPa.",
  inputs: [
    {
      description: "Void ratio e1 at the start of the loading increment.",
      id: "voidRatioStart",
      kind: "number",
      label: "e1",
      minimum: 0,
    },
    {
      description: "Void ratio e2 at the end of the loading increment.",
      id: "voidRatioEnd",
      kind: "number",
      label: "e2",
      minimum: 0,
    },
    {
      description: "Effective vertical stress sigma1' in kPa.",
      id: "effectiveStressStartKpa",
      kind: "number",
      label: "sigma1'",
      minimum: 0,
    },
    {
      description: "Effective vertical stress sigma2' in kPa.",
      id: "effectiveStressEndKpa",
      kind: "number",
      label: "sigma2'",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Compression index Cc (dimensionless slope of the e - log10 sigma' virgin curve).",
      id: "compressionIndex",
      kind: "number",
      label: "Cc",
    },
  ],
  calculate: (input) =>
    calculateCompressionIndex(input as unknown as CompressionIndexInput),
});

export const runCompressionIndex = compressionIndexTool.execute;
export default compressionIndexTool;
