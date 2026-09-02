import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSeparatedSandMassKg: readonly number[];
  readonly observedSeparatedSiltClayMassKg: readonly number[];
  readonly uncapturedSandAnalysisMassKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRecoveredComponentPercent: number;
  readonly recoveredMassClosureFraction: number;
}>;
const inputFields = [
  {
    id: "observedSeparatedSandMassKg",
    label: "Observed separated sand mass kg",
    kind: "numberList",
  },
  {
    id: "observedSeparatedSiltClayMassKg",
    label: "Observed separated silt clay mass kg",
    kind: "numberList",
  },
  {
    id: "uncapturedSandAnalysisMassKg",
    label: "Uncaptured sand analysis mass kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSeparatedSandMassKg.forEach((v) =>
    nonnegative(v, "observedSeparatedSandMassKg"),
  );
  input.observedSeparatedSiltClayMassKg.forEach((v) =>
    nonnegative(v, "observedSeparatedSiltClayMassKg"),
  );
  input.uncapturedSandAnalysisMassKg.forEach((v) =>
    nonnegative(v, "uncapturedSandAnalysisMassKg"),
  );
  aligned(
    input.observedSeparatedSandMassKg,
    input.observedSeparatedSiltClayMassKg,
    "observedSeparatedSandMassKg",
  );
  aligned(
    input.observedSeparatedSandMassKg,
    input.uncapturedSandAnalysisMassKg,
    "observedSeparatedSandMassKg",
  );
  const target = sum(input.observedSeparatedSandMassKg),
    recovered = target + sum(input.observedSeparatedSiltClayMassKg),
    total = recovered + sum(input.uncapturedSandAnalysisMassKg);
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
  observedSeparatedSandMassKg: [1, 2],
  observedSeparatedSiltClayMassKg: [3, 4],
  uncapturedSandAnalysisMassKg: [1, 1],
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
  id: "agriculture/soil-texture-sand-percentage",
  title: "Agriculture Soil Texture Sand Percentage Calculator",
  description:
    "Audit actual separated sand component across paired particle-fraction tests and independently uncaptured mass; recovery closure explicit, not complement of unverified percentages. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedSeparatedSandMassKg:
        value.observedSeparatedSandMassKg as readonly number[],
      observedSeparatedSiltClayMassKg:
        value.observedSeparatedSiltClayMassKg as readonly number[],
      uncapturedSandAnalysisMassKg:
        value.uncapturedSandAnalysisMassKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
