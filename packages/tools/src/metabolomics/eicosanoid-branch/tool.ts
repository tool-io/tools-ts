import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coxProducts: readonly number[];
  readonly loxProducts: readonly number[];
}>;
export type Output = Readonly<{
  readonly coxTotal: number;
  readonly loxTotal: number;
  readonly dominantBranch: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.coxProducts.some((v) => v < 0) ||
    input.loxProducts.some((v) => v < 0)
  )
    simpleError("coxProducts", "Eicosanoid signals must be nonnegative.");
  const coxTotal = input.coxProducts.reduce((a, b) => a + b, 0),
    loxTotal = input.loxProducts.reduce((a, b) => a + b, 0);
  return {
    coxTotal,
    loxTotal,
    dominantBranch:
      coxTotal === loxTotal ? "tie" : coxTotal > loxTotal ? "COX" : "LOX",
  };
};
export const exampleInput = {
  coxProducts: [2, 3],
  loxProducts: [4, 1],
} satisfies Input;
export const exampleOutput = {
  coxTotal: 5,
  loxTotal: 5,
  dominantBranch: "tie",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/eicosanoid-branch",
  title: "Eicosanoid Branch",
  description: "Compare caller-assigned COX and LOX eicosanoid branch signals.",
  inputs: [
    { id: "coxProducts", kind: "numberList", label: "Cox products" },
    { id: "loxProducts", kind: "numberList", label: "Lox products" },
  ],
  outputs: [
    { id: "coxTotal", kind: "number", label: "Cox total" },
    { id: "loxTotal", kind: "number", label: "Lox total" },
    { id: "dominantBranch", kind: "string", label: "Dominant branch" },
  ],
  calculate: (value) =>
    calculate({
      coxProducts: value.coxProducts as readonly number[],
      loxProducts: value.loxProducts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
