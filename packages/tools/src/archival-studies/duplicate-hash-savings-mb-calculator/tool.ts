import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DuplicateHashSavingsMbCalculatorInput = {
  readonly totalSizeMb: number;
  readonly uniqueSizeMb: number;
};

export type DuplicateHashSavingsMbCalculatorOutput = {
  readonly savedMb: number;
  readonly savingsPercent: number;
};

export const calculateDuplicateHashSavingsMbCalculator = (
  input: DuplicateHashSavingsMbCalculatorInput,
): DuplicateHashSavingsMbCalculatorOutput => {
  const total = input.totalSizeMb;
  const unique = input.uniqueSizeMb;
  if (!Number.isFinite(total) || total <= 0)
    simpleError(
      "totalSizeMb",
      "Total size must be a finite number greater than 0 MB.",
      "invalid_total",
    );
  if (!Number.isFinite(unique) || unique < 0)
    simpleError(
      "uniqueSizeMb",
      "Unique size must be a finite number at least 0 MB.",
      "invalid_unique",
    );
  if (unique > total)
    simpleError(
      "uniqueSizeMb",
      "Unique size cannot exceed the total size.",
      "invalid_unique",
    );
  const savedMb = total - unique;
  if (!Number.isFinite(savedMb))
    simpleError("uniqueSizeMb", "Saved size overflowed.", "numeric_overflow");
  const savingsPercent = (savedMb / total) * 100;
  if (!Number.isFinite(savingsPercent))
    simpleError(
      "totalSizeMb",
      "Savings percent could not be calculated.",
      "numeric_overflow",
    );
  return {
    savedMb: savedMb === 0 ? 0 : savedMb,
    savingsPercent: savingsPercent === 0 ? 0 : savingsPercent,
  };
};

export const duplicateHashSavingsMbCalculatorExample = {
  input: { totalSizeMb: 2048, uniqueSizeMb: 1536 },
  output: { savedMb: 512, savingsPercent: 25 },
} satisfies ToolExample<
  DuplicateHashSavingsMbCalculatorInput,
  DuplicateHashSavingsMbCalculatorOutput
>;

export const duplicateHashSavingsMbCalculatorTool = createSimpleTool({
  id: "archival-studies/duplicate-hash-savings-mb-calculator",
  title: "Duplicate File Hash Set Deduplication Savings MB Calculator",
  description:
    "Quantify deduplication savings in megabytes and percent from the total accession size and the size remaining after hash-based duplicate removal.",
  inputs: [
    {
      description: "Total file payload before deduplication, in MB.",
      id: "totalSizeMb",
      kind: "number",
      label: "Total size (MB)",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Payload retained after removing hash duplicates, in MB.",
      id: "uniqueSizeMb",
      kind: "number",
      label: "Unique size (MB)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Storage saved by removing duplicates, in MB.",
      id: "savedMb",
      kind: "number",
      label: "Saved (MB)",
    },
    {
      description: "Savings as a percentage of the total size.",
      id: "savingsPercent",
      kind: "number",
      label: "Savings percent",
    },
  ],
  calculate: (input) =>
    calculateDuplicateHashSavingsMbCalculator({
      totalSizeMb: input.totalSizeMb as number,
      uniqueSizeMb: input.uniqueSizeMb as number,
    }),
});

export const runDuplicateHashSavingsMbCalculator =
  duplicateHashSavingsMbCalculatorTool.execute;
export default duplicateHashSavingsMbCalculatorTool;
