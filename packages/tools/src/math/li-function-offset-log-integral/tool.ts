import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, simpson } from "../batch-shared.js";
export type Input = Readonly<{
  readonly x: number;
  readonly simpsonPanels: number;
}>;
export type Output = Readonly<{ readonly offsetLogarithmicIntegral: number }>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
  { id: "simpsonPanels", label: "Simpson panels", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.x <= 1 || input.x > 1000000)
    simpleError(
      "x",
      "Offset Li(x)=∫2^x dt/log(t) requires 1<x≤10^6, excluding singularity crossing.",
    );
  const lo = Math.min(2, input.x),
    hi = Math.max(2, input.x),
    v = simpson((t) => 1 / Math.log(t), lo, hi, input.simpsonPanels);
  return { offsetLogarithmicIntegral: input.x < 2 ? -v : v };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 4, simpsonPanels: 100 } satisfies Input;
export const exampleOutput = {
  offsetLogarithmicIntegral: 1.9224213202006408,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/li-function-offset-log-integral",
  title: "Offset Log Integral Li Calculator",
  description:
    "Approximate offset logarithmic integral Li(x)=∫2^x dt/log t by caller even-panel Simpson rule; no principal-value li(x), singularity crossing or automatic quadrature error bound.",
  inputs: inputFields,
  outputs: [
    {
      id: "offsetLogarithmicIntegral",
      label: "Offset logarithmic integral",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      x: value.x as number,
      simpsonPanels: value.simpsonPanels as number,
    }),
});
export const run = tool.execute;
export default tool;
