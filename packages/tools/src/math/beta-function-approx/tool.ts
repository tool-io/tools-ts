import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, logGamma } from "../batch-shared.js";
export type Input = Readonly<{ readonly a: number; readonly b: number }>;
export type Output = Readonly<{
  readonly betaValue: number;
  readonly logBetaValue: number;
}>;
const inputFields = [
  { id: "a", label: "A", kind: "number" },
  { id: "b", label: "B", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.a <= 0 || input.b <= 0 || input.a > 1000 || input.b > 1000)
    simpleError("shapes", "Positive beta shapes at most 1000 required.");
  const l = logGamma(input.a) + logGamma(input.b) - logGamma(input.a + input.b);
  return { betaValue: Math.exp(l), logBetaValue: l };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { a: 2, b: 3 } satisfies Input;
export const exampleOutput = {
  betaValue: 0.08333333333333333,
  logBetaValue: -2.4849066497880004,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/beta-function-approx",
  title: "Beta Function Approximation",
  description:
    "Evaluate positive real beta function and stable logarithm from Lanczos log gamma; no probability distribution sampling or continuation across beta poles.",
  inputs: inputFields,
  outputs: [
    { id: "betaValue", label: "Beta value", kind: "number" },
    { id: "logBetaValue", label: "Log beta value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ a: value.a as number, b: value.b as number }),
});
export const run = tool.execute;
export default tool;
