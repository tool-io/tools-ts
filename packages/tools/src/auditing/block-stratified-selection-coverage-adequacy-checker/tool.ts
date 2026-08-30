import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlockCoverageInput = {
  readonly actualAllocation: ReadonlyArray<number>;
  readonly plannedAllocation: ReadonlyArray<number>;
};

export type BlockCoverageOutput = {
  readonly coveragePercent: number;
  readonly deficits: ReadonlyArray<number>;
  readonly uncoveredBlockCount: number;
};

export const checkBlockStratifiedCoverage = (
  input: BlockCoverageInput,
): BlockCoverageOutput => {
  if (
    !Array.isArray(input.plannedAllocation) ||
    !Array.isArray(input.actualAllocation)
  )
    simpleError(
      "",
      "Planned and actual allocations must be arrays.",
      "allocation_data_required",
    );
  if (
    input.plannedAllocation.length === 0 ||
    input.plannedAllocation.length !== input.actualAllocation.length
  )
    simpleError(
      "actualAllocation",
      "Each nonempty planned block must have one actual allocation.",
      "allocation_length_mismatch",
    );
  let plannedTotal = 0;
  let actualTotal = 0;
  const deficits: number[] = [];
  let uncoveredBlockCount = 0;
  for (const [index, planned] of input.plannedAllocation.entries()) {
    const actual = input.actualAllocation[index]!;
    for (const [field, value] of [
      [`plannedAllocation.${index}`, planned],
      [`actualAllocation.${index}`, actual],
    ] as const)
      if (!Number.isFinite(value) || value < 0 || value > 1)
        simpleError(
          field,
          "Block allocations must be fractions from 0 through 1.",
          "invalid_block_allocation",
        );
    plannedTotal += planned;
    actualTotal += actual;
    const deficit = Math.max(0, planned - actual);
    if (deficit > 0) uncoveredBlockCount += 1;
    deficits.push(deficit);
  }
  if (plannedTotal <= 0)
    simpleError(
      "plannedAllocation",
      "Planned allocation must have a positive total.",
      "zero_planned_allocation",
    );
  if (plannedTotal > 1 || actualTotal > 1)
    simpleError(
      "",
      "Planned and actual allocation totals must not exceed 1.",
      "allocation_total_exceeds_one",
    );
  return {
    coveragePercent: (actualTotal / plannedTotal) * 100,
    deficits,
    uncoveredBlockCount,
  };
};

export const blockCoverageExample = {
  input: {
    actualAllocation: [0.4, 0.3, 0.2],
    plannedAllocation: [0.5, 0.3, 0.2],
  },
  output: {
    coveragePercent: 89.99999999999999,
    deficits: [0.09999999999999998, 0, 0],
    uncoveredBlockCount: 1,
  },
} satisfies ToolExample<BlockCoverageInput, BlockCoverageOutput>;

export const blockCoverageTool = createSimpleTool({
  calculate: (input) =>
    checkBlockStratifiedCoverage({
      actualAllocation: input.actualAllocation as number[],
      plannedAllocation: input.plannedAllocation as number[],
    }),
  description:
    "Compare actual and planned block-stratified allocation fractions, report each coverage deficit, and calculate aggregate coverage percent.",
  id: "auditing/block-stratified-selection-coverage-adequacy-checker",
  inputs: [
    {
      description: "Actual sampled fraction for each block.",
      id: "actualAllocation",
      kind: "numberList",
      label: "Actual allocation",
    },
    {
      description: "Planned sampled fraction for each block.",
      id: "plannedAllocation",
      kind: "numberList",
      label: "Planned allocation",
    },
  ],
  outputs: [
    {
      id: "coveragePercent",
      kind: "number",
      label: "Aggregate coverage",
      minimum: 0,
      unit: "percent",
    },
    { id: "deficits", kind: "numberList", label: "Block deficits" },
    {
      id: "uncoveredBlockCount",
      kind: "integer",
      label: "Deficient blocks",
      minimum: 0,
    },
  ],
  title: "Block Stratified Selection Coverage Adequacy Checker",
});

export const runBlockCoverage = blockCoverageTool.execute;
export default blockCoverageTool;
