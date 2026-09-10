import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualReachHeightMeters: number;
  readonly actualAdditionalMeasuredCeilingDistanceMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualReachHeightMeters",
    label: "Actual reach height meters",
    kind: "number",
  },
  {
    id: "actualAdditionalMeasuredCeilingDistanceMeters",
    label: "Actual additional measured ceiling distance meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualReachHeightMeters, "reach");
  nonnegative(input.actualAdditionalMeasuredCeilingDistanceMeters, "remainder");
  return {
    observedCeilingHeightMeters:
      input.actualReachHeightMeters +
      input.actualAdditionalMeasuredCeilingDistanceMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualReachHeightMeters: 2,
    actualAdditionalMeasuredCeilingDistanceMeters: 3,
  },
  output: { result: { observedCeilingHeightMeters: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/ceiling-height-reach-adder",
  title: "Ceiling Height Reach Measurement Adder",
  description:
    "Actual vertical reach plus actual vertical measured remainder; not slanted tape length or safely reachable height.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
