import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly proposedAdjustments: readonly number[];
  readonly recordedAdjustmentIndexes: readonly number[];
}>;
export type Output = Readonly<{
  readonly proposedTotal: number;
  readonly recordedTotal: number;
  readonly unrecordedTotal: number;
  readonly unrecordedIndexes: readonly number[];
  readonly unrecordedCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.proposedAdjustments.length === 0 ||
    input.recordedAdjustmentIndexes.some(
      (value) =>
        !Number.isSafeInteger(value) ||
        value < 0 ||
        value >= input.proposedAdjustments.length,
    )
  )
    simpleError(
      "recordedAdjustmentIndexes",
      "Adjustments must be nonempty and indexes valid.",
      "invalid_adjustments",
    );
  const recorded = new Set(input.recordedAdjustmentIndexes),
    unrecordedIndexes = input.proposedAdjustments
      .map((_, index) => (recorded.has(index) ? -1 : index))
      .filter((index) => index >= 0),
    proposedTotal = input.proposedAdjustments.reduce((a, b) => a + b, 0),
    recordedTotal = input.proposedAdjustments.reduce(
      (sum, value, index) => sum + (recorded.has(index) ? value : 0),
      0,
    );
  return {
    proposedTotal,
    recordedTotal,
    unrecordedTotal: proposedTotal - recordedTotal,
    unrecordedIndexes,
    unrecordedCount: unrecordedIndexes.length,
  };
};

export const exampleInput = {
  proposedAdjustments: [100, -20, 50],
  recordedAdjustmentIndexes: [0, 2],
} satisfies Input;
export const exampleOutput = {
  proposedTotal: 130,
  recordedTotal: 150,
  unrecordedTotal: -20,
  unrecordedIndexes: [1],
  unrecordedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      proposedAdjustments: input.proposedAdjustments as readonly number[],
      recordedAdjustmentIndexes:
        input.recordedAdjustmentIndexes as readonly number[],
    }),
  description: "Track recorded and unrecorded proposed audit adjustments.",
  id: "auditing/adjustment-disposition",
  inputs: [
    {
      id: "proposedAdjustments",
      label: "Proposed adjustment amounts",
      kind: "numberList",
    },
    {
      id: "recordedAdjustmentIndexes",
      label: "Zero-based recorded adjustment indexes",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "proposedTotal",
      label: "Total proposed adjustments",
      kind: "number",
    },
    {
      id: "recordedTotal",
      label: "Total recorded adjustments",
      kind: "number",
    },
    {
      id: "unrecordedTotal",
      label: "Total unrecorded adjustments",
      kind: "number",
    },
    {
      id: "unrecordedIndexes",
      label: "Unrecorded adjustment indexes",
      kind: "numberList",
    },
    {
      id: "unrecordedCount",
      label: "Unrecorded adjustment count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Adjustment Disposition",
});

export const run = tool.execute;
export default tool;
