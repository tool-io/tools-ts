import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedBoltStrains: readonly number[];
  readonly callerMatchedAxialStiffnessN: readonly number[];
  readonly callerIndependentlyMeasuredPreloadsN: readonly number[];
  readonly observedIndependentLoadCellN: readonly number[];
}>;
export type Output = Readonly<{
  readonly strainInferredBoltTensionsN: readonly number[];
  readonly signedLoadCellMinusStrainTensionN: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBoltStrains",
    label: "Observed bolt strains",
    kind: "numberList",
  },
  {
    id: "callerMatchedAxialStiffnessN",
    label: "Caller matched axial stiffness n",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredPreloadsN",
    label: "Caller independently measured preloads n",
    kind: "numberList",
  },
  {
    id: "observedIndependentLoadCellN",
    label: "Observed independent load cell n",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedAxialStiffnessN.forEach((v) =>
    positive(v, "callerMatchedAxialStiffnessN"),
  );
  input.observedBoltStrains.forEach((v) =>
    nonnegative(v, "observedBoltStrains"),
  );
  input.callerIndependentlyMeasuredPreloadsN.forEach((v) =>
    nonnegative(v, "callerIndependentlyMeasuredPreloadsN"),
  );
  aligned(
    input.observedBoltStrains,
    input.callerMatchedAxialStiffnessN,
    "observedBoltStrains",
  );
  aligned(
    input.observedBoltStrains,
    input.callerIndependentlyMeasuredPreloadsN,
    "observedBoltStrains",
  );
  aligned(
    input.observedBoltStrains,
    input.observedIndependentLoadCellN,
    "observedBoltStrains",
  );
  const forces = input.observedBoltStrains.map(
    (v, i) =>
      v * input.callerMatchedAxialStiffnessN[i] +
      input.callerIndependentlyMeasuredPreloadsN[i],
  );
  return {
    strainInferredBoltTensionsN: forces,
    signedLoadCellMinusStrainTensionN: forces.map(
      (v, i) => input.observedIndependentLoadCellN[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBoltStrains: [0.001, 0.002],
  callerMatchedAxialStiffnessN: [10000, 20000],
  callerIndependentlyMeasuredPreloadsN: [5, 10],
  observedIndependentLoadCellN: [20, 40],
} satisfies Input;
export const exampleOutput = {
  strainInferredBoltTensionsN: [15, 50],
  signedLoadCellMinusStrainTensionN: [5, -10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rock-bolt-tension",
  title: "Rock Bolt Tension Calculator",
  description:
    "Reconcile actual calibrated bolt strain/preload tension with independent load cells, not axial stress×area design force, spacing or support readiness. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "strainInferredBoltTensionsN",
      label: "Strain inferred bolt tensions n",
      kind: "numberList",
    },
    {
      id: "signedLoadCellMinusStrainTensionN",
      label: "Signed load cell minus strain tension n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBoltStrains: value.observedBoltStrains as readonly number[],
      callerMatchedAxialStiffnessN:
        value.callerMatchedAxialStiffnessN as readonly number[],
      callerIndependentlyMeasuredPreloadsN:
        value.callerIndependentlyMeasuredPreloadsN as readonly number[],
      observedIndependentLoadCellN:
        value.observedIndependentLoadCellN as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
