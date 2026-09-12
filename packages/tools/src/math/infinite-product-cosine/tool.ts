import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualX: number;
  readonly actualDepth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualX", label: "Actual x", kind: "number" },
  { id: "actualDepth", label: "Actual depth", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualDepth, "depth", 1, 1000);
  if (Math.abs(input.actualX) > 100) simpleError("x", "Bounded|x|≤100.");
  let v = 1;
  for (let k = 1; k <= input.actualDepth; k++)
    v *= Math.cos(input.actualX / 2 ** k);
  return { truncatedCosineProduct: v };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualX: 1, actualDepth: 1 },
  output: { result: { truncatedCosineProduct: 0.8775825618903728 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/infinite-product-cosine",
  title: "Infinite Product Cosine Approximation",
  description:
    "Finite \u03a0k=1\u2026Ncos(x/2^k), limit sinc(x) distinct, not arbitrary infinite product. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
