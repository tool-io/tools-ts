import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQ: number;
  readonly actualDepth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualQ", label: "Actual q", kind: "number" },
  { id: "actualDepth", label: "Actual depth", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualQ, "q");
  if (input.actualQ <= 0 || input.actualQ >= 1) simpleError("q", "Real0<q<1.");
  bounded(input.actualDepth, "depth", 1, 256);
  let d = 1;
  for (let k = input.actualDepth; k >= 1; k--) d = 1 + input.actualQ ** k / d;
  return { truncatedContinuedFraction: input.actualQ ** 0.2 / d };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQ: 0.25, actualDepth: 1 },
  output: { result: { truncatedContinuedFraction: 0.6062866266041592 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/rogers-ramanujan-continued-fraction-approx",
  title: "Rogers-Ramanujan Continued Fraction Approximation",
  description:
    "Rogers\u2013Ramanujancontinuedfractionq^(1/5)/(1+q/(1+q\u00b2/(\u2026))), finite explicit depth, no certified infinite convergence error. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
