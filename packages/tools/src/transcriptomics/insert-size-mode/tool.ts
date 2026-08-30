import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly insertSizesBp: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeBp: number;
  readonly modeCount: number;
  readonly uniqueInsertSizes: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.insertSizesBp.length === 0 ||
    input.insertSizesBp.some((v) => v < 0 || !Number.isSafeInteger(v))
  )
    simpleError("insertSizesBp", "Nonnegative integer insert sizes required.");
  const counts = new Map<number, number>();
  for (const v of input.insertSizesBp) counts.set(v, (counts.get(v) ?? 0) + 1);
  const sorted = [...counts].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  return {
    modeBp: sorted[0][0],
    modeCount: sorted[0][1],
    uniqueInsertSizes: counts.size,
  };
};

export const exampleInput = {
  insertSizesBp: [100, 200, 200, 300],
} satisfies Input;
export const exampleOutput = {
  modeBp: 200,
  modeCount: 2,
  uniqueInsertSizes: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/insert-size-mode",
  title: "Insert Size Mode",
  description:
    "Find the modal insert size, breaking ties toward the shorter fragment.",
  inputs: [
    { id: "insertSizesBp", kind: "numberList", label: "Insert sizes bp" },
  ],
  outputs: [
    { id: "modeBp", kind: "number", label: "Mode bp" },
    { id: "modeCount", kind: "number", label: "Mode count" },
    { id: "uniqueInsertSizes", kind: "number", label: "Unique insert sizes" },
  ],
  calculate: (value) =>
    calculate({
      insertSizesBp: value.insertSizesBp as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
