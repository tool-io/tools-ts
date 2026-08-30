import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, struve } from "../batch-shared.js";
export type Input = Readonly<{ readonly order: number; readonly x: number }>;
export type Output = Readonly<{ readonly struveHValue: number }>;
const inputFields = [
  { id: "order", label: "Order", kind: "number" },
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { struveHValue: struve(input.order, input.x) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { order: 0, x: 1 } satisfies Input;
export const exampleOutput = {
  struveHValue: 0.5686566270482879,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/struve-function-approx",
  title: "Struve Function Approximation",
  description:
    "Evaluate Struve H_ν real power series for integer order 0..5 and x∈[0,20]; fixed family/order convention, bounded convergence, no ambiguous unnamed special function.",
  inputs: inputFields,
  outputs: [{ id: "struveHValue", label: "Struve h value", kind: "number" }],
  calculate: (value) =>
    calculate({ order: value.order as number, x: value.x as number }),
});
export const run = tool.execute;
export default tool;
