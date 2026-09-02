import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly normalizedFocalX: number;
  readonly normalizedFocalY: number;
  readonly callerPermittedGridDistance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "normalizedFocalX", label: "Normalized focal x", kind: "number" },
  { id: "normalizedFocalY", label: "Normalized focal y", kind: "number" },
  {
    id: "callerPermittedGridDistance",
    label: "Caller permitted grid distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.normalizedFocalX, "x");
  fraction(input.normalizedFocalY, "y");
  nonnegative(input.callerPermittedGridDistance, "tolerance");
  const d = Math.min(
    ...[input.normalizedFocalX, input.normalizedFocalY].flatMap((v) => [
      Math.abs(v - 1 / 3),
      Math.abs(v - 2 / 3),
    ]),
  );
  return {
    nearestThirdsLineDistance: d,
    withinCallerLineDistance: d <= input.callerPermittedGridDistance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    normalizedFocalX: 0.3333333333333333,
    normalizedFocalY: 0.5,
    callerPermittedGridDistance: 0.02,
  },
  output: {
    result: { nearestThirdsLineDistance: 0, withinCallerLineDistance: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/rule-of-thirds-composition-grid-checker",
  title: "Rule of Thirds Composition Grid Checker",
  description:
    "Distance of an actual normalized focal point to nearest thirds grid line, not intersection distance, automatic image focal point or composition quality.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
