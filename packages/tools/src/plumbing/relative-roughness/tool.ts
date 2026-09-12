import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualAbsolutePipeRoughness: number;
  readonly actualInnerDiameter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAbsolutePipeRoughness",
    label: "Actual absolute pipe roughness",
    kind: "number",
  },
  { id: "actualInnerDiameter", label: "Actual inner diameter", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualAbsolutePipeRoughness, "actualAbsolutePipeRoughness");
  positive(input.actualInnerDiameter, "actualInnerDiameter");
  return {
    value: (1 * input.actualAbsolutePipeRoughness) / input.actualInnerDiameter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualAbsolutePipeRoughness: 2, actualInnerDiameter: 4 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/relative-roughness",
  title: "Plumbing Relative Roughness Calculator",
  description:
    "Actual hydraulic relative roughness\u03b5/d, same units no friction model; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
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
