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
  readonly callerIndependentFractureStorageM3Pa: readonly number[];
  readonly callerIndependentMatrixStorageM3Pa: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerDualPorosityStorageRatiosOmega: readonly number[];
}>;
const inputFields = [
  {
    id: "callerIndependentFractureStorageM3Pa",
    label: "Caller independent fracture storage m3 pa",
    kind: "numberList",
  },
  {
    id: "callerIndependentMatrixStorageM3Pa",
    label: "Caller independent matrix storage m3 pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentFractureStorageM3Pa.forEach((v) =>
    nonnegative(v, "callerIndependentFractureStorageM3Pa"),
  );
  input.callerIndependentMatrixStorageM3Pa.forEach((v) =>
    nonnegative(v, "callerIndependentMatrixStorageM3Pa"),
  );
  aligned(
    input.callerIndependentFractureStorageM3Pa,
    input.callerIndependentMatrixStorageM3Pa,
    "callerIndependentFractureStorageM3Pa",
  );
  return {
    callerDualPorosityStorageRatiosOmega:
      input.callerIndependentFractureStorageM3Pa.map((v, i) => {
        const total = v + input.callerIndependentMatrixStorageM3Pa[i];
        positive(total, "total storativity");
        return v / total;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentFractureStorageM3Pa: [1, 2],
  callerIndependentMatrixStorageM3Pa: [3, 2],
} satisfies Input;
export const exampleOutput = {
  callerDualPorosityStorageRatiosOmega: [0.25, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/well-test-dual-porosity-omega",
  title: "Petroleum Well Test Dual Porosity Omega Calculator",
  description:
    "Evaluate explicitly independently established fracture/(fracture+matrix) storage ratios for dual porosity, not type-curve automatic inference or pore volume fractions substituted for storativity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerDualPorosityStorageRatiosOmega",
      label: "Caller dual porosity storage ratios omega",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentFractureStorageM3Pa:
        value.callerIndependentFractureStorageM3Pa as readonly number[],
      callerIndependentMatrixStorageM3Pa:
        value.callerIndependentMatrixStorageM3Pa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
