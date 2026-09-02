import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMdfInitialThicknessMm: readonly number[];
  readonly observedMdfAfterExposureThicknessMm: readonly number[];
  readonly observedMdfExposureHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedThicknessSwellingFractions: readonly number[];
  readonly observedMeanFractionChangePerHour: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMdfInitialThicknessMm",
    label: "Observed mdf initial thickness mm",
    kind: "numberList",
  },
  {
    id: "observedMdfAfterExposureThicknessMm",
    label: "Observed mdf after exposure thickness mm",
    kind: "numberList",
  },
  {
    id: "observedMdfExposureHours",
    label: "Observed mdf exposure hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMdfInitialThicknessMm.forEach((v) =>
    positive(v, "observedMdfInitialThicknessMm"),
  );
  input.observedMdfAfterExposureThicknessMm.forEach((v) =>
    positive(v, "observedMdfAfterExposureThicknessMm"),
  );
  input.observedMdfExposureHours.forEach((v) =>
    positive(v, "observedMdfExposureHours"),
  );
  aligned(
    input.observedMdfInitialThicknessMm,
    input.observedMdfAfterExposureThicknessMm,
    "observedMdfInitialThicknessMm",
  );
  aligned(
    input.observedMdfInitialThicknessMm,
    input.observedMdfExposureHours,
    "observedMdfInitialThicknessMm",
  );
  const change = input.observedMdfAfterExposureThicknessMm.map(
    (v, i) => v / input.observedMdfInitialThicknessMm[i] - 1,
  );
  return {
    observedThicknessSwellingFractions: change,
    observedMeanFractionChangePerHour: change.map(
      (v, i) => v / input.observedMdfExposureHours[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMdfInitialThicknessMm: [100, 200],
  observedMdfAfterExposureThicknessMm: [110, 220],
  observedMdfExposureHours: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedThicknessSwellingFractions: [0.1, 0.1],
  observedMeanFractionChangePerHour: [0.1, 0.05],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/mdf-quellung-prozent",
  title: "MDF Quellung Prozent Lookup",
  description:
    "Audit actual Mdf matched exposure thickness swelling and interval mean change rate, negative shrinkage retained; not forward solid-wood moisture movement coefficient, material grade approval or future rate forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedThicknessSwellingFractions",
      label: "Observed thickness swelling fractions",
      kind: "numberList",
    },
    {
      id: "observedMeanFractionChangePerHour",
      label: "Observed mean fraction change per hour",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMdfInitialThicknessMm:
        value.observedMdfInitialThicknessMm as readonly number[],
      observedMdfAfterExposureThicknessMm:
        value.observedMdfAfterExposureThicknessMm as readonly number[],
      observedMdfExposureHours:
        value.observedMdfExposureHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
