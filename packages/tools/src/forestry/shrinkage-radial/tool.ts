import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGreenRadialLengthsMm: readonly number[];
  readonly observedDryRadialLengthsMm: readonly number[];
  readonly observedMoistureDropPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedShrinkageFractions: readonly number[];
  readonly observedFractionShrinkagePerMoisturePoint: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGreenRadialLengthsMm",
    label: "Observed green radial lengths mm",
    kind: "numberList",
  },
  {
    id: "observedDryRadialLengthsMm",
    label: "Observed dry radial lengths mm",
    kind: "numberList",
  },
  {
    id: "observedMoistureDropPoints",
    label: "Observed moisture drop points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGreenRadialLengthsMm.forEach((v) =>
    positive(v, "observedGreenRadialLengthsMm"),
  );
  input.observedDryRadialLengthsMm.forEach((v) =>
    positive(v, "observedDryRadialLengthsMm"),
  );
  input.observedMoistureDropPoints.forEach((v) =>
    positive(v, "observedMoistureDropPoints"),
  );
  aligned(
    input.observedGreenRadialLengthsMm,
    input.observedDryRadialLengthsMm,
    "observedGreenRadialLengthsMm",
  );
  aligned(
    input.observedGreenRadialLengthsMm,
    input.observedMoistureDropPoints,
    "observedGreenRadialLengthsMm",
  );
  const strain = input.observedDryRadialLengthsMm.map(
    (v, i) => 1 - v / input.observedGreenRadialLengthsMm[i],
  );
  return {
    observedShrinkageFractions: strain,
    observedFractionShrinkagePerMoisturePoint: strain.map(
      (v, i) => v / input.observedMoistureDropPoints[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGreenRadialLengthsMm: [100, 200],
  observedDryRadialLengthsMm: [90, 190],
  observedMoistureDropPoints: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedShrinkageFractions: [0.1, 0.05],
  observedFractionShrinkagePerMoisturePoint: [0.01, 0.0025],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/shrinkage-radial",
  title: "Radial Shrinkage Calculator",
  description:
    "Extract actual radial shrinkage coefficients from paired dimensional/moisture-drop observations, negative apparent shrinkage retained; not forward carpenter movement coefficient. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedShrinkageFractions",
      label: "Observed shrinkage fractions",
      kind: "numberList",
    },
    {
      id: "observedFractionShrinkagePerMoisturePoint",
      label: "Observed fraction shrinkage per moisture point",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGreenRadialLengthsMm:
        value.observedGreenRadialLengthsMm as readonly number[],
      observedDryRadialLengthsMm:
        value.observedDryRadialLengthsMm as readonly number[],
      observedMoistureDropPoints:
        value.observedMoistureDropPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
