import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, logGamma, gamma } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{
  readonly gammaValue: number;
  readonly logGammaValue: number;
}>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.x < 0.0001 || input.x > 170)
    simpleError("x", "Positive real argument in [0.0001,170] required.");
  return { gammaValue: gamma(input.x), logGammaValue: logGamma(input.x) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 0.5 } satisfies Input;
export const exampleOutput = {
  gammaValue: 1.7724538509055159,
  logGammaValue: 0.5723649429247001,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/gamma-function-approx",
  title: "Gamma Function Approximation",
  description:
    "Evaluate positive real Γ(x) and log Γ(x) by Lanczos/reflection approximation over bounded finite domain; negative poles and complex continuation intentionally excluded.",
  inputs: inputFields,
  outputs: [
    { id: "gammaValue", label: "Gamma value", kind: "number" },
    { id: "logGammaValue", label: "Log gamma value", kind: "number" },
  ],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
