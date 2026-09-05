import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  sum,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedNormalTraverseM: readonly number[];
  readonly gougeFlags: readonly number[];
}>;
export type Output = Readonly<{ readonly observedGougeThicknessM: number }>;
const inputFields = [
  {
    id: "observedNormalTraverseM",
    label: "Observed normal traverse m",
    kind: "numberList",
  },
  { id: "gougeFlags", label: "Gouge flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observedNormalTraverseM, input.gougeFlags, "traverse");
  strictlyIncreasing(input.observedNormalTraverseM, "normal traverse");
  binary(input.gougeFlags, "gouge");
  return {
    observedGougeThicknessM: sum(
      input.gougeFlags
        .slice(0, -1)
        .map(
          (v, i) =>
            v *
            (input.observedNormalTraverseM[i + 1] -
              input.observedNormalTraverseM[i]),
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNormalTraverseM: [0, 1, 2],
  gougeFlags: [0, 1, 0],
} satisfies Input;
export const exampleOutput = { observedGougeThicknessM: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fault-gouge-thickness",
  title: "Geology Fault Gouge Thickness Calculator",
  description:
    "Actual mapped normal traverse, left-interval gouge flags; caller distinguishes observed segments from unobserved geological continuation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGougeThicknessM",
      label: "Observed gouge thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNormalTraverseM:
        value.observedNormalTraverseM as readonly number[],
      gougeFlags: value.gougeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
