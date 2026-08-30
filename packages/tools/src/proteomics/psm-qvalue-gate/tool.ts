import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly psmQValues: readonly number[];
  readonly maximumQValue: number;
}>;
export type Output = Readonly<{
  readonly acceptedIndexes: readonly number[];
  readonly rejectedIndexes: readonly number[];
  readonly acceptedPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.psmQValues.length === 0 ||
    input.psmQValues.some((v) => v < 0 || v > 1) ||
    input.maximumQValue < 0 ||
    input.maximumQValue > 1
  )
    simpleError("psmQValues", "PSM q-values and gate must be in [0,1].");
  const acceptedIndexes = input.psmQValues.flatMap((v, i) =>
      v <= input.maximumQValue ? [i] : [],
    ),
    rejectedIndexes = input.psmQValues.flatMap((v, i) =>
      v > input.maximumQValue ? [i] : [],
    );
  return {
    acceptedIndexes,
    rejectedIndexes,
    acceptedPercent: (acceptedIndexes.length / input.psmQValues.length) * 100,
  };
};
export const exampleInput = {
  psmQValues: [0.01, 0.04, 0.1],
  maximumQValue: 0.05,
} satisfies Input;
export const exampleOutput = {
  acceptedIndexes: [0, 1],
  rejectedIndexes: [2],
  acceptedPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/psm-qvalue-gate",
  title: "PSM Qvalue Gate",
  description: "Gate peptide-spectrum matches by supplied q-value threshold.",
  inputs: [
    { id: "psmQValues", label: "Psm q values", kind: "numberList" },
    { id: "maximumQValue", label: "Maximum q value", kind: "number" },
  ],
  outputs: [
    { id: "acceptedIndexes", label: "Accepted indexes", kind: "numberList" },
    { id: "rejectedIndexes", label: "Rejected indexes", kind: "numberList" },
    { id: "acceptedPercent", label: "Accepted percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      psmQValues: value.psmQValues as readonly number[],
      maximumQValue: value.maximumQValue as number,
    }),
});
export const run = tool.execute;
export default tool;
