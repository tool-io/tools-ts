import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly vipScores: readonly number[];
  readonly minimumVip: number;
}>;
export type Output = Readonly<{
  readonly selectedIndexes: readonly number[];
  readonly rejectedIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  if (input.vipScores.some((v) => v < 0) || input.minimumVip < 0)
    simpleError("vipScores", "VIP scores must be nonnegative.");
  return {
    selectedIndexes: input.vipScores.flatMap((v, i) =>
      v >= input.minimumVip ? [i] : [],
    ),
    rejectedIndexes: input.vipScores.flatMap((v, i) =>
      v < input.minimumVip ? [i] : [],
    ),
  };
};
export const exampleInput = {
  vipScores: [0.8, 1.2, 2],
  minimumVip: 1,
} satisfies Input;
export const exampleOutput = {
  selectedIndexes: [1, 2],
  rejectedIndexes: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/vip-threshold-gate",
  title: "VIP Threshold Gate",
  description:
    "Gate variable-importance scores against a supplied VIP minimum.",
  inputs: [
    { id: "vipScores", kind: "numberList", label: "Vip scores" },
    { id: "minimumVip", kind: "number", label: "Minimum vip" },
  ],
  outputs: [
    { id: "selectedIndexes", kind: "numberList", label: "Selected indexes" },
    { id: "rejectedIndexes", kind: "numberList", label: "Rejected indexes" },
  ],
  calculate: (value) =>
    calculate({
      vipScores: value.vipScores as readonly number[],
      minimumVip: value.minimumVip as number,
    }),
});
export const run = tool.execute;
export default tool;
