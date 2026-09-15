import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly outerToInnerRadiusRatio: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "outerToInnerRadiusRatio",
    label: "Outer to inner radius ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.outerToInnerRadiusRatio, "ratio");
  if (i.outerToInnerRadiusRatio < 1)
    simpleError("ratio", "Outer/inner ratio>=1.");
  return {
    roundedAsymptoticThresholdExceeded: i.outerToInnerRadiusRatio > 11.94,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { outerToInnerRadiusRatio: 12 },
  output: { result: { roundedAsymptoticThresholdExceeded: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/bielliptic-advantage-threshold-1194-checker",
  title: "Superperiodic Bielliptic Advantage Ratio Threshold 11.94 Checker",
  description:
    "Rounded asymptotic bielliptic comparison threshold screen for ideal circular coplanar radii; finite apoapsis/transfer time can change advantage.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
