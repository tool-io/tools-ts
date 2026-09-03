import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, portions } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedUsablePizzaDoughG: number;
  readonly callerBallMassG: number;
}>;
export type Output = Readonly<{
  readonly completePortions: number;
  readonly unallocatedAmount: number;
}>;
const inputFields = [
  {
    id: "observedUsablePizzaDoughG",
    label: "Observed usable pizza dough g",
    kind: "number",
  },
  { id: "callerBallMassG", label: "Caller ball mass g", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return portions(input.observedUsablePizzaDoughG, input.callerBallMassG);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUsablePizzaDoughG: 1000,
  callerBallMassG: 300,
} satisfies Input;
export const exampleOutput = {
  completePortions: 3,
  unallocatedAmount: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/pizza-dough-balls-from-weight",
  title: "Cooking Pizza Dough Balls From Weight Calculator",
  description:
    "Whole pizza dough-ball allocation from actual usable mass, leftover retained; no nominal fermentation mass gain. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "completePortions", label: "Complete portions", kind: "number" },
    { id: "unallocatedAmount", label: "Unallocated amount", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedUsablePizzaDoughG: value.observedUsablePizzaDoughG as number,
      callerBallMassG: value.callerBallMassG as number,
    }),
});
export const run = tool.execute;
export default tool;
