import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedParticleboardInitialThicknessMm: readonly number[];
  readonly observedParticleboardAfterExposureThicknessMm: readonly number[];
  readonly observedParticleboardExposureHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedThicknessSwellingFractions: readonly number[];
  readonly observedMeanFractionChangePerHour: readonly number[];
}>;
const inputFields = [
  {
    id: "observedParticleboardInitialThicknessMm",
    label: "Observed particleboard initial thickness mm",
    kind: "numberList",
  },
  {
    id: "observedParticleboardAfterExposureThicknessMm",
    label: "Observed particleboard after exposure thickness mm",
    kind: "numberList",
  },
  {
    id: "observedParticleboardExposureHours",
    label: "Observed particleboard exposure hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedParticleboardInitialThicknessMm.forEach((v) =>
    positive(v, "observedParticleboardInitialThicknessMm"),
  );
  input.observedParticleboardAfterExposureThicknessMm.forEach((v) =>
    positive(v, "observedParticleboardAfterExposureThicknessMm"),
  );
  input.observedParticleboardExposureHours.forEach((v) =>
    positive(v, "observedParticleboardExposureHours"),
  );
  aligned(
    input.observedParticleboardInitialThicknessMm,
    input.observedParticleboardAfterExposureThicknessMm,
    "observedParticleboardInitialThicknessMm",
  );
  aligned(
    input.observedParticleboardInitialThicknessMm,
    input.observedParticleboardExposureHours,
    "observedParticleboardInitialThicknessMm",
  );
  const change = input.observedParticleboardAfterExposureThicknessMm.map(
    (v, i) => v / input.observedParticleboardInitialThicknessMm[i] - 1,
  );
  return {
    observedThicknessSwellingFractions: change,
    observedMeanFractionChangePerHour: change.map(
      (v, i) => v / input.observedParticleboardExposureHours[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedParticleboardInitialThicknessMm: [100, 200],
  observedParticleboardAfterExposureThicknessMm: [110, 220],
  observedParticleboardExposureHours: [1, 2],
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
  id: "carpentry/spanplatte-quellung-prozent",
  title: "Spanplatte Quellung Prozent Lookup",
  description:
    "Audit actual Particleboard matched exposure thickness swelling and interval mean change rate, negative shrinkage retained; not forward solid-wood moisture movement coefficient, material grade approval or future rate forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedParticleboardInitialThicknessMm:
        value.observedParticleboardInitialThicknessMm as readonly number[],
      observedParticleboardAfterExposureThicknessMm:
        value.observedParticleboardAfterExposureThicknessMm as readonly number[],
      observedParticleboardExposureHours:
        value.observedParticleboardExposureHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
