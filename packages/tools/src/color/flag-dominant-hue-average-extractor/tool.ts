import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  hue,
  nonnegative,
  positive,
  aligned,
  binary,
  sum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedHueDegrees: readonly number[];
  readonly observedPixelOrAreaWeights: readonly number[];
  readonly chromaticEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedCircularHueDegrees: number;
  readonly meanChromaticHueAvailable: boolean;
  readonly chromaticWeightFraction: number;
  readonly weightedResultantLength: number;
}>;
const inputFields = [
  {
    id: "observedHueDegrees",
    label: "Observed hue degrees",
    kind: "numberList",
  },
  {
    id: "observedPixelOrAreaWeights",
    label: "Observed pixel or area weights",
    kind: "numberList",
  },
  {
    id: "chromaticEvidenceFlags",
    label: "Chromatic evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPixelOrAreaWeights.forEach((v) =>
    nonnegative(v, "observedPixelOrAreaWeights"),
  );
  binary(input.chromaticEvidenceFlags, "chromaticEvidenceFlags");
  aligned(
    input.observedHueDegrees,
    input.observedPixelOrAreaWeights,
    "observedHueDegrees",
  );
  aligned(
    input.observedHueDegrees,
    input.chromaticEvidenceFlags,
    "observedHueDegrees",
  );
  const angles = input.observedHueDegrees.map(hue),
    total = positive(sum(input.observedPixelOrAreaWeights), "totalWeight"),
    chromatic = sum(
      input.observedPixelOrAreaWeights.filter(
        (_, i) => input.chromaticEvidenceFlags[i] === 1,
      ),
    ),
    x = chromatic
      ? sum(
          angles.map(
            (a, i) =>
              input.chromaticEvidenceFlags[i] *
              input.observedPixelOrAreaWeights[i] *
              Math.cos((a * Math.PI) / 180),
          ),
        ) / chromatic
      : 0,
    y = chromatic
      ? sum(
          angles.map(
            (a, i) =>
              input.chromaticEvidenceFlags[i] *
              input.observedPixelOrAreaWeights[i] *
              Math.sin((a * Math.PI) / 180),
          ),
        ) / chromatic
      : 0,
    R = Math.hypot(x, y),
    available = chromatic > 0 && R > 1e-12;
  return {
    weightedCircularHueDegrees: available
      ? hue((Math.atan2(y, x) * 180) / Math.PI)
      : 0,
    meanChromaticHueAvailable: available,
    chromaticWeightFraction: chromatic / total,
    weightedResultantLength: R,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHueDegrees: [350, 10],
  observedPixelOrAreaWeights: [1, 1],
  chromaticEvidenceFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  weightedCircularHueDegrees: 0,
  meanChromaticHueAvailable: true,
  chromaticWeightFraction: 1,
  weightedResultantLength: 0.984807753012208,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/flag-dominant-hue-average-extractor",
  title: "Flag Dominant Hue Average Extractor",
  description:
    "Extract weighted circular mean from caller annotated flag/image hue samples, excluding achromatic evidence while retaining its area share; not image decoding, dominant-cluster inference or a hue for white/black areas.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedCircularHueDegrees",
      label: "Weighted circular hue degrees",
      kind: "number",
    },
    {
      id: "meanChromaticHueAvailable",
      label: "Mean chromatic hue available",
      kind: "boolean",
    },
    {
      id: "chromaticWeightFraction",
      label: "Chromatic weight fraction",
      kind: "number",
    },
    {
      id: "weightedResultantLength",
      label: "Weighted resultant length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHueDegrees: value.observedHueDegrees as readonly number[],
      observedPixelOrAreaWeights:
        value.observedPixelOrAreaWeights as readonly number[],
      chromaticEvidenceFlags: value.chromaticEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
