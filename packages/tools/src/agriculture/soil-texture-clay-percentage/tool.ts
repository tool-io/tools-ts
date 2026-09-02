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
  readonly observedSeparatedClayMassKg: readonly number[];
  readonly observedSeparatedSandSiltMassKg: readonly number[];
  readonly uncapturedClayAnalysisMassKg: readonly number[];
  readonly callerMatchedAliquotToWholeDispersionFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRecoveredComponentPercent: number;
  readonly recoveredMassClosureFraction: number;
}>;
const inputFields = [
  {
    id: "observedSeparatedClayMassKg",
    label: "Observed separated clay mass kg",
    kind: "numberList",
  },
  {
    id: "observedSeparatedSandSiltMassKg",
    label: "Observed separated sand silt mass kg",
    kind: "numberList",
  },
  {
    id: "uncapturedClayAnalysisMassKg",
    label: "Uncaptured clay analysis mass kg",
    kind: "numberList",
  },
  {
    id: "callerMatchedAliquotToWholeDispersionFactors",
    label: "Caller matched aliquot to whole dispersion factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSeparatedClayMassKg,
    input.callerMatchedAliquotToWholeDispersionFactors,
    "aliquot expansion",
  );
  input.callerMatchedAliquotToWholeDispersionFactors.forEach((v) => {
    positive(v, "aliquot expansion");
    if (v < 1)
      simpleError("aliquot", "Aliquot-to-whole factor must be at least one.");
  });
  input.observedSeparatedClayMassKg.forEach((v) =>
    nonnegative(v, "observedSeparatedClayMassKg"),
  );
  input.observedSeparatedSandSiltMassKg.forEach((v) =>
    nonnegative(v, "observedSeparatedSandSiltMassKg"),
  );
  input.uncapturedClayAnalysisMassKg.forEach((v) =>
    nonnegative(v, "uncapturedClayAnalysisMassKg"),
  );
  aligned(
    input.observedSeparatedClayMassKg,
    input.observedSeparatedSandSiltMassKg,
    "observedSeparatedClayMassKg",
  );
  aligned(
    input.observedSeparatedClayMassKg,
    input.uncapturedClayAnalysisMassKg,
    "observedSeparatedClayMassKg",
  );
  const target = sum(
      input.observedSeparatedClayMassKg.map(
        (v, i) => v * input.callerMatchedAliquotToWholeDispersionFactors[i],
      ),
    ),
    recovered = target + sum(input.observedSeparatedSandSiltMassKg),
    total = recovered + sum(input.uncapturedClayAnalysisMassKg);
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
  observedSeparatedClayMassKg: [1, 2],
  observedSeparatedSandSiltMassKg: [3, 4],
  uncapturedClayAnalysisMassKg: [1, 1],
  callerMatchedAliquotToWholeDispersionFactors: [1, 1],
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
  id: "agriculture/soil-texture-clay-percentage",
  title: "Agriculture Soil Texture Clay Percentage Calculator",
  description:
    "Expand independently isolated clay dry aliquot masses to whole matched dispersion using explicit aliquot-to-whole volume factors before pooling recovered sand+silt and uncaptured mass. Different from sieved sand or silt-by-fine-minus-clay sedimentation; caller establishes method and applicability, not texture identity or an agronomic recommendation.",
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
      observedSeparatedClayMassKg:
        value.observedSeparatedClayMassKg as readonly number[],
      observedSeparatedSandSiltMassKg:
        value.observedSeparatedSandSiltMassKg as readonly number[],
      uncapturedClayAnalysisMassKg:
        value.uncapturedClayAnalysisMassKg as readonly number[],
      callerMatchedAliquotToWholeDispersionFactors:
        value.callerMatchedAliquotToWholeDispersionFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
