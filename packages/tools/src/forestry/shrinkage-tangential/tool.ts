import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGreenTangentialLengthsMm: readonly number[];
  readonly observedDryTangentialLengthsMm: readonly number[];
  readonly observedMoistureDropPoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedShrinkageFractions: readonly number[];
  readonly observedFractionShrinkagePerMoisturePoint: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGreenTangentialLengthsMm",
    label: "Observed green tangential lengths mm",
    kind: "numberList",
  },
  {
    id: "observedDryTangentialLengthsMm",
    label: "Observed dry tangential lengths mm",
    kind: "numberList",
  },
  {
    id: "observedMoistureDropPoints",
    label: "Observed moisture drop points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGreenTangentialLengthsMm.forEach((v) =>
    positive(v, "observedGreenTangentialLengthsMm"),
  );
  input.observedDryTangentialLengthsMm.forEach((v) =>
    positive(v, "observedDryTangentialLengthsMm"),
  );
  input.observedMoistureDropPoints.forEach((v) =>
    positive(v, "observedMoistureDropPoints"),
  );
  aligned(
    input.observedGreenTangentialLengthsMm,
    input.observedDryTangentialLengthsMm,
    "observedGreenTangentialLengthsMm",
  );
  aligned(
    input.observedGreenTangentialLengthsMm,
    input.observedMoistureDropPoints,
    "observedGreenTangentialLengthsMm",
  );
  const strain = input.observedDryTangentialLengthsMm.map(
    (v, i) => 1 - v / input.observedGreenTangentialLengthsMm[i],
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
  observedGreenTangentialLengthsMm: [100, 200],
  observedDryTangentialLengthsMm: [90, 190],
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
  id: "forestry/shrinkage-tangential",
  title: "Tangential Shrinkage Calculator",
  description:
    "Extract actual tangential shrinkage coefficients from paired dimensional/moisture-drop observations, negative apparent shrinkage retained; not forward carpenter movement coefficient. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedGreenTangentialLengthsMm:
        value.observedGreenTangentialLengthsMm as readonly number[],
      observedDryTangentialLengthsMm:
        value.observedDryTangentialLengthsMm as readonly number[],
      observedMoistureDropPoints:
        value.observedMoistureDropPoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
