import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly parallaxMas: number;
  readonly standardErrorMas: number;
}>;
export type Output = Readonly<{
  readonly distanceParsecs: number;
  readonly linearStandardErrorParsecs: number;
  readonly invertedLowerParsecs: number;
  readonly invertedUpperParsecs: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.parallaxMas, "parallaxMas");
  nonnegative(input.standardErrorMas, "standardErrorMas");
  if (input.standardErrorMas >= input.parallaxMas)
    simpleError(
      "standardErrorMas",
      "This positive reciprocal interval requires parallax greater than its error; no Bayesian distance is inferred.",
    );
  return {
    distanceParsecs: 1000 / input.parallaxMas,
    linearStandardErrorParsecs:
      (1000 * input.standardErrorMas) / input.parallaxMas ** 2,
    invertedLowerParsecs: 1000 / (input.parallaxMas + input.standardErrorMas),
    invertedUpperParsecs: 1000 / (input.parallaxMas - input.standardErrorMas),
  };
};
export const exampleInput = {
  parallaxMas: 10,
  standardErrorMas: 1,
} satisfies Input;
export const exampleOutput = {
  distanceParsecs: 100,
  linearStandardErrorParsecs: 10,
  invertedLowerParsecs: 90.9090909090909,
  invertedUpperParsecs: 111.11111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/positive-parallax-distance-uncertainty",
  title: "Positive Parallax Distance Uncertainty",
  description:
    "Compare first-order distance uncertainty with the asymmetric inversion of a supplied ±1-error positive-parallax interval; neither is a posterior credible interval.",
  inputs: [
    { id: "parallaxMas", label: "Parallax mas", kind: "number" },
    { id: "standardErrorMas", label: "Standard error mas", kind: "number" },
  ],
  outputs: [
    { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
    {
      id: "linearStandardErrorParsecs",
      label: "Linear standard error parsecs",
      kind: "number",
    },
    {
      id: "invertedLowerParsecs",
      label: "Inverted lower parsecs",
      kind: "number",
    },
    {
      id: "invertedUpperParsecs",
      label: "Inverted upper parsecs",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      parallaxMas: value.parallaxMas as number,
      standardErrorMas: value.standardErrorMas as number,
    }),
});
export const run = tool.execute;
export default tool;
