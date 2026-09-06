import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerIndependentMatrixShapeFactorsPerM2: readonly number[];
  readonly observedWellboreRadiiM: readonly number[];
  readonly callerMatchedMatrixPermeabilitiesM2: readonly number[];
  readonly callerMatchedFracturePermeabilitiesM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerWarrenRootInterporosityLambda: readonly number[];
}>;
const inputFields = [
  {
    id: "callerIndependentMatrixShapeFactorsPerM2",
    label: "Caller independent matrix shape factors per m2",
    kind: "numberList",
  },
  {
    id: "observedWellboreRadiiM",
    label: "Observed wellbore radii m",
    kind: "numberList",
  },
  {
    id: "callerMatchedMatrixPermeabilitiesM2",
    label: "Caller matched matrix permeabilities m2",
    kind: "numberList",
  },
  {
    id: "callerMatchedFracturePermeabilitiesM2",
    label: "Caller matched fracture permeabilities m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentMatrixShapeFactorsPerM2.forEach((v) =>
    positive(v, "callerIndependentMatrixShapeFactorsPerM2"),
  );
  input.observedWellboreRadiiM.forEach((v) =>
    positive(v, "observedWellboreRadiiM"),
  );
  input.callerMatchedMatrixPermeabilitiesM2.forEach((v) =>
    positive(v, "callerMatchedMatrixPermeabilitiesM2"),
  );
  input.callerMatchedFracturePermeabilitiesM2.forEach((v) =>
    positive(v, "callerMatchedFracturePermeabilitiesM2"),
  );
  aligned(
    input.observedWellboreRadiiM,
    input.callerIndependentMatrixShapeFactorsPerM2,
    "observedWellboreRadiiM",
  );
  aligned(
    input.observedWellboreRadiiM,
    input.callerMatchedMatrixPermeabilitiesM2,
    "observedWellboreRadiiM",
  );
  aligned(
    input.observedWellboreRadiiM,
    input.callerMatchedFracturePermeabilitiesM2,
    "observedWellboreRadiiM",
  );
  return {
    callerWarrenRootInterporosityLambda: input.observedWellboreRadiiM.map(
      (v, i) =>
        (input.callerIndependentMatrixShapeFactorsPerM2[i] *
          v *
          v *
          input.callerMatchedMatrixPermeabilitiesM2[i]) /
        input.callerMatchedFracturePermeabilitiesM2[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentMatrixShapeFactorsPerM2: [2, 4],
  observedWellboreRadiiM: [1, 2],
  callerMatchedMatrixPermeabilitiesM2: [1, 1],
  callerMatchedFracturePermeabilitiesM2: [10, 20],
} satisfies Input;
export const exampleOutput = {
  callerWarrenRootInterporosityLambda: [0.2, 0.8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/well-test-dual-porosity-lambda",
  title: "Petroleum Well Test Dual Porosity Lambda Calculator",
  description:
    "Explicit Warren–Root λ=α rw² km/kf with independent block shape factorα in m⁻², not guessed cubic-block factor or automatic type-curve fitting. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWarrenRootInterporosityLambda",
      label: "Caller warren root interporosity lambda",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentMatrixShapeFactorsPerM2:
        value.callerIndependentMatrixShapeFactorsPerM2 as readonly number[],
      observedWellboreRadiiM: value.observedWellboreRadiiM as readonly number[],
      callerMatchedMatrixPermeabilitiesM2:
        value.callerMatchedMatrixPermeabilitiesM2 as readonly number[],
      callerMatchedFracturePermeabilitiesM2:
        value.callerMatchedFracturePermeabilitiesM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
