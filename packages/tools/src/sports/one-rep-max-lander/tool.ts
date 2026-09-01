import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedLoadKg: number;
  readonly observedRepetitions: number;
}>;
export type Output = Readonly<{
  readonly regressionEstimatedOneRepMaxKg: number;
}>;
const inputFields = [
  { id: "observedLoadKg", label: "Observed load kg", kind: "number" },
  { id: "observedRepetitions", label: "Observed repetitions", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLoadKg, "observedLoadKg");
  bounded(input.observedRepetitions, "repetitions", 1, 12);
  return {
    regressionEstimatedOneRepMaxKg:
      (100 * input.observedLoadKg) /
      (101.3 - 2.67123 * input.observedRepetitions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoadKg: 50,
  observedRepetitions: 5,
} satisfies Input;
export const exampleOutput = {
  regressionEstimatedOneRepMaxKg: 56.854458839361705,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/one-rep-max-lander",
  title: "Lander 1RM Calculator",
  description:
    "Evaluate named Lander repetition/load regression on 1–12 observed repetitions; distinct from existing Epley/Brzycki comparison, not measured maximum, load prescription or lifting safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "regressionEstimatedOneRepMaxKg",
      label: "Regression estimated one rep max kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoadKg: value.observedLoadKg as number,
      observedRepetitions: value.observedRepetitions as number,
    }),
});
export const run = tool.execute;
export default tool;
