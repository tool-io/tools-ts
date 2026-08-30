import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InventoryObservationInput = {
  readonly controlTags: ReadonlyArray<number>;
  readonly firstCounts: ReadonlyArray<number>;
  readonly secondCounts: ReadonlyArray<number>;
  readonly tolerance: number;
};

export type InventoryObservationOutput = {
  readonly countDifferences: ReadonlyArray<number>;
  readonly discrepancyCount: number;
  readonly reconciled: boolean;
  readonly uncountedIndices: ReadonlyArray<number>;
};

export const compareInventoryObservationCounts = (
  input: InventoryObservationInput,
): InventoryObservationOutput => {
  if (
    !Array.isArray(input.firstCounts) ||
    !Array.isArray(input.secondCounts) ||
    !Array.isArray(input.controlTags)
  )
    simpleError(
      "",
      "Counts and control tags must be arrays.",
      "inventory_data_required",
    );
  if (
    input.firstCounts.length === 0 ||
    input.firstCounts.length !== input.secondCounts.length ||
    input.firstCounts.length !== input.controlTags.length
  )
    simpleError(
      "secondCounts",
      "Each first count must have a second count and control tag.",
      "inventory_data_length_mismatch",
    );
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const countDifferences: number[] = [];
  const uncountedIndices: number[] = [];
  let discrepancyCount = 0;
  for (const [index, firstCount] of input.firstCounts.entries()) {
    const secondCount = input.secondCounts[index]!;
    const controlTag = input.controlTags[index]!;
    for (const [field, value] of [
      [`firstCounts.${index}`, firstCount],
      [`secondCounts.${index}`, secondCount],
    ] as const)
      if (!Number.isFinite(value) || value < 0)
        simpleError(
          field,
          "Counts must be finite and nonnegative.",
          "invalid_inventory_count",
        );
    if (controlTag !== 0 && controlTag !== 1)
      simpleError(
        `controlTags.${index}`,
        "Control tags must be 0 or 1.",
        "invalid_control_tag",
      );
    const difference = Math.abs(secondCount - firstCount);
    countDifferences.push(difference);
    if (controlTag === 0) uncountedIndices.push(index);
    if (difference > input.tolerance || controlTag === 0) discrepancyCount += 1;
  }
  return {
    countDifferences,
    discrepancyCount,
    reconciled: discrepancyCount === 0,
    uncountedIndices,
  };
};

export const inventoryObservationExample = {
  input: {
    controlTags: [1, 1, 0],
    firstCounts: [100, 50, 25],
    secondCounts: [100, 52, 25],
    tolerance: 1,
  },
  output: {
    countDifferences: [0, 2, 0],
    discrepancyCount: 2,
    reconciled: false,
    uncountedIndices: [2],
  },
} satisfies ToolExample<InventoryObservationInput, InventoryObservationOutput>;

export const inventoryObservationTool = createSimpleTool({
  calculate: (input) =>
    compareInventoryObservationCounts({
      controlTags: input.controlTags as number[],
      firstCounts: input.firstCounts as number[],
      secondCounts: input.secondCounts as number[],
      tolerance: input.tolerance as number,
    }),
  description:
    "Compare two inventory counts, retain uncounted items, and report every difference above tolerance or item without a control tag.",
  id: "auditing/inventory-observation-count-tag-two-team-controls-lookup",
  inputs: [
    {
      description: "One binary control tag for each item.",
      id: "controlTags",
      kind: "numberList",
      label: "Control tags",
    },
    {
      description: "Count from the first observation team.",
      id: "firstCounts",
      kind: "numberList",
      label: "First counts",
    },
    {
      description: "Count from the second observation team.",
      id: "secondCounts",
      kind: "numberList",
      label: "Second counts",
    },
    { id: "tolerance", kind: "number", label: "Count tolerance", minimum: 0 },
  ],
  outputs: [
    {
      id: "countDifferences",
      kind: "numberList",
      label: "Absolute count differences",
    },
    {
      id: "discrepancyCount",
      kind: "integer",
      label: "Discrepancies",
      minimum: 0,
    },
    { id: "reconciled", kind: "boolean", label: "Observation reconciled" },
    {
      id: "uncountedIndices",
      kind: "numberList",
      label: "Uncontrolled item indices",
    },
  ],
  title: "Inventory Observation Count Tag Two-Team Controls Lookup",
});

export const runInventoryObservation = inventoryObservationTool.execute;
export default inventoryObservationTool;
