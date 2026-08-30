import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly liftKg: number;
  readonly bodyMassKg: number;
  readonly massExponent: number;
}>;
export type Output = Readonly<{
  readonly allometricStrength: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.liftKg < 0 ||
    input.bodyMassKg <= 0 ||
    input.massExponent < 0 ||
    input.massExponent > 1
  )
    simpleError(
      "bodyMassKg",
      "Nonnegative lift, positive body mass, and exponent within [0,1] required.",
    );
  return {
    allometricStrength: input.liftKg / input.bodyMassKg ** input.massExponent,
  };
};
export const exampleInput = {
  liftKg: 200,
  bodyMassKg: 100,
  massExponent: 0.5,
} satisfies Input;
export const exampleOutput = { allometricStrength: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/allometric-lift-strength",
  title: "Allometric Lift Strength",
  description:
    "Normalize lifting performance by a caller-defined body-mass exponent.",
  inputs: [
    { id: "liftKg", label: "Lift kg", kind: "number" },
    { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
    { id: "massExponent", label: "Mass exponent", kind: "number" },
  ],
  outputs: [
    { id: "allometricStrength", label: "Allometric strength", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      liftKg: value.liftKg as number,
      bodyMassKg: value.bodyMassKg as number,
      massExponent: value.massExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
