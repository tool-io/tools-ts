import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  integer,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedIntervalLengthsM: readonly number[];
  readonly observedImageFractureCounts: readonly number[];
  readonly imageCoverageFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly coverageCorrectedLinearFractureDensitiesPerM: readonly number[];
  readonly pooledObservedDensityPerM: number;
}>;
const inputFields = [
  {
    id: "observedIntervalLengthsM",
    label: "Observed interval lengths m",
    kind: "numberList",
  },
  {
    id: "observedImageFractureCounts",
    label: "Observed image fracture counts",
    kind: "numberList",
  },
  {
    id: "imageCoverageFractions",
    label: "Image coverage fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIntervalLengthsM.forEach((v) =>
    positive(v, "observedIntervalLengthsM"),
  );
  input.imageCoverageFractions.forEach((v) =>
    positive(v, "imageCoverageFractions"),
  );
  input.observedImageFractureCounts.forEach((v) =>
    nonnegative(v, "observedImageFractureCounts"),
  );
  aligned(
    input.observedIntervalLengthsM,
    input.observedImageFractureCounts,
    "observedIntervalLengthsM",
  );
  aligned(
    input.observedIntervalLengthsM,
    input.imageCoverageFractions,
    "observedIntervalLengthsM",
  );
  input.observedImageFractureCounts.forEach((v) => integer(v, "count"));
  input.imageCoverageFractions.forEach((v) => fraction(v, "coverage"));
  const l = input.observedIntervalLengthsM.map(
    (v, i) => v * input.imageCoverageFractions[i],
  );
  return {
    coverageCorrectedLinearFractureDensitiesPerM:
      input.observedImageFractureCounts.map((v, i) => v / l[i]),
    pooledObservedDensityPerM: sum(input.observedImageFractureCounts) / sum(l),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntervalLengthsM: [2, 3],
  observedImageFractureCounts: [4, 3],
  imageCoverageFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  coverageCorrectedLinearFractureDensitiesPerM: [2, 2],
  pooledObservedDensityPerM: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/petrophysical-borehole-image-fracture-density",
  title: "Geology Petrophysical Borehole Image Fracture Density Calculator",
  description:
    "Linear image fracture counts per actual imaged length; explicit completeness fractions, no areal network or assumed full borehole coverage. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "coverageCorrectedLinearFractureDensitiesPerM",
      label: "Coverage corrected linear fracture densities per m",
      kind: "numberList",
    },
    {
      id: "pooledObservedDensityPerM",
      label: "Pooled observed density per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIntervalLengthsM:
        value.observedIntervalLengthsM as readonly number[],
      observedImageFractureCounts:
        value.observedImageFractureCounts as readonly number[],
      imageCoverageFractions: value.imageCoverageFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
