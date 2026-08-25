import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShrinkagePercentInventoryLossInput = {
  readonly bookInventoryUnits: number;
  readonly physicalCountUnits: number;
};

export type ShrinkagePercentInventoryLossOutput = {
  readonly shrinkagePercent: number;
  readonly unitsLost: number;
};

export const calculateShrinkagePercentInventoryLoss = (
  input: ShrinkagePercentInventoryLossInput,
): ShrinkagePercentInventoryLossOutput => {
  if (!(
    Number.isSafeInteger(input.bookInventoryUnits) &&
    input.bookInventoryUnits > 0
  ))
    return simpleError(
      "bookInventoryUnits",
      "Book inventory must be a positive whole number.",
      "invalid_inventory",
    );
  if (!(
    Number.isSafeInteger(input.physicalCountUnits) &&
    input.physicalCountUnits >= 0
  ))
    return simpleError(
      "physicalCountUnits",
      "The physical count must be a non-negative whole number.",
      "invalid_inventory",
    );
  const unitsLost = input.bookInventoryUnits - input.physicalCountUnits;
  return {
    unitsLost,
    shrinkagePercent: (unitsLost / input.bookInventoryUnits) * 100,
  };
};

export const shrinkagePercentInventoryLossExample = {
  input: { bookInventoryUnits: 1250, physicalCountUnits: 1212 },
  output: { shrinkagePercent: 3.04, unitsLost: 38 },
} satisfies ToolExample<
  ShrinkagePercentInventoryLossInput,
  ShrinkagePercentInventoryLossOutput
>;

export const shrinkagePercentInventoryLossTool = createSimpleTool({
  id: "logistics/shrinkage-percent-inventory-loss",
  title: "Shrinkage Percent Inventory Loss Calculator",
  description:
    "Compute inventory shrinkage as the gap between book inventory and the physical count; negative results identify a counted overage rather than a loss.",
  inputs: [
    {
      description: "Units recorded on the books before counting.",
      id: "bookInventoryUnits",
      kind: "integer",
      label: "Book units",
      minimum: 1,
    },
    {
      description:
        "Units found in the physical count; may exceed the book quantity when an overage is found.",
      id: "physicalCountUnits",
      kind: "integer",
      label: "Counted units",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Units missing relative to the book record; negative means an overage.",
      id: "unitsLost",
      kind: "integer",
      label: "Units lost",
    },
    {
      description:
        "Shrinkage as a percent of book inventory; negative means an overage.",
      id: "shrinkagePercent",
      kind: "number",
      label: "Shrinkage %",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateShrinkagePercentInventoryLoss({
      bookInventoryUnits: input.bookInventoryUnits as number,
      physicalCountUnits: input.physicalCountUnits as number,
    }),
});

export const runShrinkagePercentInventoryLoss =
  shrinkagePercentInventoryLossTool.execute;
export default shrinkagePercentInventoryLossTool;
