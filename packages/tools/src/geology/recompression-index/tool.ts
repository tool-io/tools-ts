import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RecompressionIndexInput = {
  readonly voidRatioStart: number;
  readonly voidRatioEnd: number;
  readonly effectiveStressStartKpa: number;
  readonly effectiveStressEndKpa: number;
};

export type RecompressionIndexOutput = {
  readonly recompressionIndex: number;
};

export const calculateRecompressionIndex = (
  input: RecompressionIndexInput,
): RecompressionIndexOutput => {
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
      "End stress must exceed the start stress along the reload curve.",
      "invalid_stress",
    );
  if (!(input.voidRatioStart >= 0) || !(input.voidRatioEnd >= 0))
    simpleError(
      "voidRatioStart",
      "Void ratios must be non-negative.",
      "invalid_void_ratio",
    );
  return {
    recompressionIndex:
      (input.voidRatioStart - input.voidRatioEnd) /
      Math.log10(input.effectiveStressEndKpa / input.effectiveStressStartKpa),
  };
};

export const recompressionIndexExample = {
  input: {
    voidRatioStart: 0.9,
    voidRatioEnd: 0.88,
    effectiveStressStartKpa: 200,
    effectiveStressEndKpa: 400,
  },
  output: { recompressionIndex: 0.0664385618977473 },
} satisfies ToolExample<RecompressionIndexInput, RecompressionIndexOutput>;

export const recompressionIndexTool = createSimpleTool({
  id: "geology/recompression-index",
  title: "Recompression Index Calculator",
  description:
    "Recompression (swell/reload) index Cr = Cs = (e1 - e2) / log10(sigma2' / sigma1') measured on an unload-reload loop of an oedometer test. Void ratios dimensionless, effective stresses in kPa.",
  inputs: [
    {
      description: "Void ratio e1 at the start of the reload increment.",
      id: "voidRatioStart",
      kind: "number",
      label: "e1",
      minimum: 0,
    },
    {
      description: "Void ratio e2 at the end of the reload increment.",
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
      description: "Recompression index Cr (dimensionless).",
      id: "recompressionIndex",
      kind: "number",
      label: "Cr",
    },
  ],
  calculate: (input) =>
    calculateRecompressionIndex(input as unknown as RecompressionIndexInput),
});

export const runRecompressionIndex = recompressionIndexTool.execute;
export default recompressionIndexTool;
