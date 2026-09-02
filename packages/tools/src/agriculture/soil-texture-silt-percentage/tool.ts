import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedFineSiltClayMassKg: readonly number[];
  readonly observedIncludedClayMassKg: readonly number[];
  readonly observedSeparatedSandMassKg: readonly number[];
  readonly uncapturedSiltAnalysisMassKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRecoveredComponentPercent: number;
  readonly recoveredMassClosureFraction: number;
}>;
const inputFields = [
  {
    id: "observedFineSiltClayMassKg",
    label: "Observed fine silt clay mass kg",
    kind: "numberList",
  },
  {
    id: "observedSeparatedSandMassKg",
    label: "Observed separated sand mass kg",
    kind: "numberList",
  },
  {
    id: "observedIncludedClayMassKg",
    label: "Observed included clay mass kg",
    kind: "numberList",
  },
  {
    id: "uncapturedSiltAnalysisMassKg",
    label: "Uncaptured silt analysis mass kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedFineSiltClayMassKg,
    input.observedIncludedClayMassKg,
    "fine/clay sedimentation",
  );
  input.observedIncludedClayMassKg.forEach((v, i) => {
    nonnegative(v, "clay");
    if (v > input.observedFineSiltClayMassKg[i])
      simpleError("clay", "Clay exceeds observed fine sedimentation mass.");
  });
  input.observedFineSiltClayMassKg.forEach((v) =>
    nonnegative(v, "observedFineSiltClayMassKg"),
  );
  input.observedSeparatedSandMassKg.forEach((v) =>
    nonnegative(v, "observedSeparatedSandMassKg"),
  );
  input.uncapturedSiltAnalysisMassKg.forEach((v) =>
    nonnegative(v, "uncapturedSiltAnalysisMassKg"),
  );
  aligned(
    input.observedFineSiltClayMassKg,
    input.observedSeparatedSandMassKg,
    "observedFineSiltClayMassKg",
  );
  aligned(
    input.observedFineSiltClayMassKg,
    input.uncapturedSiltAnalysisMassKg,
    "observedFineSiltClayMassKg",
  );
  const target = sum(
      input.observedFineSiltClayMassKg.map(
        (v, i) => v - input.observedIncludedClayMassKg[i],
      ),
    ),
    recovered =
      sum(input.observedFineSiltClayMassKg) +
      sum(input.observedSeparatedSandMassKg),
    total = recovered + sum(input.uncapturedSiltAnalysisMassKg);
  positive(recovered, "recovered material");
  return {
    observedRecoveredComponentPercent: (100 * target) / recovered,
    recoveredMassClosureFraction: recovered / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFineSiltClayMassKg: [2, 3],
  observedIncludedClayMassKg: [1, 1],
  observedSeparatedSandMassKg: [2, 3],
  uncapturedSiltAnalysisMassKg: [1, 1],
} satisfies Input;
export const exampleOutput = {
  observedRecoveredComponentPercent: 30,
  recoveredMassClosureFraction: 0.8333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-texture-silt-percentage",
  title: "Agriculture Soil Texture Silt Percentage Calculator",
  description:
    "Infer silt by subtracting independently measured included CLAY from observed fine-fraction sedimentation mass, then pool with separately sieved sand and uncaptured mass closure. Caller establishes matched fraction-separation method; not a texture identity or agronomic recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRecoveredComponentPercent",
      label: "Observed recovered component percent",
      kind: "number",
    },
    {
      id: "recoveredMassClosureFraction",
      label: "Recovered mass closure fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFineSiltClayMassKg:
        value.observedFineSiltClayMassKg as readonly number[],
      observedIncludedClayMassKg:
        value.observedIncludedClayMassKg as readonly number[],
      observedSeparatedSandMassKg:
        value.observedSeparatedSandMassKg as readonly number[],
      uncapturedSiltAnalysisMassKg:
        value.uncapturedSiltAnalysisMassKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
