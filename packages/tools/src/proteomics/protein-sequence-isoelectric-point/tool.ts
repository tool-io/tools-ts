import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinCharge } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly pkas: readonly number[];
  readonly iterations: number;
}>;
export type Output = Readonly<{
  readonly isoelectricPh: number;
  readonly residualCharge: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.iterations) ||
    input.iterations < 1 ||
    input.iterations > 100
  )
    simpleError(
      "iterations",
      "Bisection iterations must be an integer from 1 to 100.",
    );
  let lo = 0,
    hi = 14;
  for (let i = 0; i < input.iterations; i++) {
    const mid = (lo + hi) / 2,
      charge = proteinCharge(input.sequence, mid, input.pkas);
    if (Math.abs(charge) < 1e-12)
      return { isoelectricPh: mid, residualCharge: charge };
    if (charge > 0) lo = mid;
    else hi = mid;
  }
  const isoelectricPh = (lo + hi) / 2;
  return {
    isoelectricPh,
    residualCharge: proteinCharge(input.sequence, isoelectricPh, input.pkas),
  };
};
export const exampleInput = {
  sequence: "A",
  pkas: [7, 7, 10, 12, 6, 4, 4, 8, 10],
  iterations: 32,
} satisfies Input;
export const exampleOutput = {
  isoelectricPh: 7,
  residualCharge: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-sequence-isoelectric-point",
  title: "Protein Sequence Isoelectric Point",
  description:
    "Estimate sequence isoelectric pH by bisection of caller-parameterized charge.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "pkas", label: "Pkas", kind: "numberList" },
    { id: "iterations", label: "Iterations", kind: "number" },
  ],
  outputs: [
    { id: "isoelectricPh", label: "Isoelectric ph", kind: "number" },
    { id: "residualCharge", label: "Residual charge", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      pkas: value.pkas as readonly number[],
      iterations: value.iterations as number,
    }),
});
export const run = tool.execute;
export default tool;
