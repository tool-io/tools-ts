import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBcryptCost: number;
  readonly observedBcryptMilliseconds: number;
  readonly targetBcryptCost: number;
}>;
export type Output = Readonly<{
  readonly idealDoublingScaledMilliseconds: number;
  readonly costDoublingFactor: number;
}>;
const inputFields = [
  { id: "observedBcryptCost", label: "Observed bcrypt cost", kind: "number" },
  {
    id: "observedBcryptMilliseconds",
    label: "Observed bcrypt milliseconds",
    kind: "number",
  },
  { id: "targetBcryptCost", label: "Target bcrypt cost", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedBcryptCost, "cost", 4, 31);
  bounded(input.targetBcryptCost, "cost", 4, 31);
  positive(input.observedBcryptMilliseconds, "measurement");
  const factor = 2 ** (input.targetBcryptCost - input.observedBcryptCost);
  return {
    idealDoublingScaledMilliseconds: input.observedBcryptMilliseconds * factor,
    costDoublingFactor: factor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBcryptCost: 10,
  observedBcryptMilliseconds: 100,
  targetBcryptCost: 12,
} satisfies Input;
export const exampleOutput = {
  idealDoublingScaledMilliseconds: 400,
  costDoublingFactor: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/bcrypt-cost-factor-time-scaling-lookup",
  title: "bcrypt Cost Time Scaling Lookup",
  description:
    "Scale caller measured bcrypt time under explicit ideal2^cost assumption only, not recommended cost/hardware benchmark or password security guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealDoublingScaledMilliseconds",
      label: "Ideal doubling scaled milliseconds",
      kind: "number",
    },
    { id: "costDoublingFactor", label: "Cost doubling factor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedBcryptCost: value.observedBcryptCost as number,
      observedBcryptMilliseconds: value.observedBcryptMilliseconds as number,
      targetBcryptCost: value.targetBcryptCost as number,
    }),
});
export const run = tool.execute;
export default tool;
