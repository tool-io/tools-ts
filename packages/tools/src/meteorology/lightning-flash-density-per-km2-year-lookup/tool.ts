import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  integer,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentlyDeduplicatedFlashCount: number;
  readonly observedCoveredAreaKM2: number;
  readonly observedCoverageYears: number;
  readonly independentDetectionEfficiency: number;
}>;
export type Output = Readonly<{
  readonly efficiencyAdjustedFlashDensityPerKM2Year: number;
}>;
const inputFields = [
  {
    id: "independentlyDeduplicatedFlashCount",
    label: "Independently deduplicated flash count",
    kind: "number",
  },
  {
    id: "observedCoveredAreaKM2",
    label: "Observed covered area k m2",
    kind: "number",
  },
  {
    id: "observedCoverageYears",
    label: "Observed coverage years",
    kind: "number",
  },
  {
    id: "independentDetectionEfficiency",
    label: "Independent detection efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedCoveredAreaKM2, "observedCoveredAreaKM2");
  positive(input.observedCoverageYears, "observedCoverageYears");
  positive(
    input.independentDetectionEfficiency,
    "independentDetectionEfficiency",
  );
  nonnegative(
    input.independentlyDeduplicatedFlashCount,
    "independentlyDeduplicatedFlashCount",
  );
  integer(input.independentlyDeduplicatedFlashCount, "flashes");
  fraction(input.independentDetectionEfficiency, "efficiency");
  return {
    efficiencyAdjustedFlashDensityPerKM2Year:
      input.independentlyDeduplicatedFlashCount /
      (input.observedCoveredAreaKM2 *
        input.observedCoverageYears *
        input.independentDetectionEfficiency),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyDeduplicatedFlashCount: 100,
  observedCoveredAreaKM2: 10,
  observedCoverageYears: 2,
  independentDetectionEfficiency: 0.5,
} satisfies Input;
export const exampleOutput = {
  efficiencyAdjustedFlashDensityPerKM2Year: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/lightning-flash-density-per-km2-year-lookup",
  title: "Lightning Flash Density Per KM2 Year Lookup",
  description:
    "Actual deduplicated flash density over covered space/time and independent detection efficiency; strokes not substituted for flashes, no lightning forecast. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "efficiencyAdjustedFlashDensityPerKM2Year",
      label: "Efficiency adjusted flash density per k m2 year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyDeduplicatedFlashCount:
        value.independentlyDeduplicatedFlashCount as number,
      observedCoveredAreaKM2: value.observedCoveredAreaKM2 as number,
      observedCoverageYears: value.observedCoverageYears as number,
      independentDetectionEfficiency:
        value.independentDetectionEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;
