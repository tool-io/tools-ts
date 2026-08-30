import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly precursorMz: number;
  readonly productMz: readonly number[];
  readonly expectedNeutralLosses: readonly number[];
  readonly toleranceMz: number;
}>;
export type Output = Readonly<{
  readonly observedLosses: readonly number[];
  readonly matchedLossIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (
    input.precursorMz <= 0 ||
    input.productMz.some((v) => v <= 0 || v > input.precursorMz) ||
    input.expectedNeutralLosses.some((v) => v <= 0) ||
    input.toleranceMz < 0
  )
    simpleError("productMz", "Products must not exceed the precursor mass.");
  const observedLosses = input.productMz.map((v) => input.precursorMz - v);
  return {
    observedLosses,
    matchedLossIndexes: observedLosses.flatMap((v, i) =>
      input.expectedNeutralLosses.some(
        (expected) => Math.abs(v - expected) <= input.toleranceMz,
      )
        ? [i]
        : [],
    ),
  };
};
export const exampleInput = {
  precursorMz: 200,
  productMz: [182, 172],
  expectedNeutralLosses: [18, 28],
  toleranceMz: 0,
} satisfies Input;
export const exampleOutput = {
  observedLosses: [18, 28],
  matchedLossIndexes: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/neutral-loss-matcher",
  title: "Neutral Loss Matcher",
  description:
    "Match product-ion neutral losses against caller-provided diagnostic differences.",
  inputs: [
    { id: "precursorMz", kind: "number", label: "Precursor mz" },
    { id: "productMz", kind: "numberList", label: "Product mz" },
    {
      id: "expectedNeutralLosses",
      kind: "numberList",
      label: "Expected neutral losses",
    },
    { id: "toleranceMz", kind: "number", label: "Tolerance mz" },
  ],
  outputs: [
    { id: "observedLosses", kind: "numberList", label: "Observed losses" },
    {
      id: "matchedLossIndexes",
      kind: "numberList",
      label: "Matched loss indexes",
    },
  ],
  calculate: (value) =>
    calculate({
      precursorMz: value.precursorMz as number,
      productMz: value.productMz as readonly number[],
      expectedNeutralLosses: value.expectedNeutralLosses as readonly number[],
      toleranceMz: value.toleranceMz as number,
    }),
});
export const run = tool.execute;
export default tool;
