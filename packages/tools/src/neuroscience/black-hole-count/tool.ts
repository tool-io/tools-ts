import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  binary,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedT1BlackHoleEligibilityFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedT1BlackHoleEligibilityFlags",
    label: "Actual independently qualified t1 black hole eligibility flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyQualifiedT1BlackHoleEligibilityFlags.length)
    simpleError(
      "actualIndependentlyQualifiedT1BlackHoleEligibilityFlags",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyQualifiedT1BlackHoleEligibilityFlags.forEach((v) =>
    nonnegative(v, "actualIndependentlyQualifiedT1BlackHoleEligibilityFlags"),
  );
  binary(
    input.actualIndependentlyQualifiedT1BlackHoleEligibilityFlags,
    "qualified",
  );
  return {
    value: sum(input.actualIndependentlyQualifiedT1BlackHoleEligibilityFlags),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyQualifiedT1BlackHoleEligibilityFlags: [1, 0, 1] },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/black-hole-count",
  title: "Black Hole Count Tool",
  description:
    "Count actual separately assessed distinctcandidateT1hypointenselesion eligible flags, not classify MRI intensities or identify astronomical black holes. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
