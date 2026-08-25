import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SeedTanninIndexCheckerInput = {
  readonly seedTanninIndex: number;
  readonly ripeThreshold?: number;
};

export type SeedTanninIndexCheckerOutput = {
  readonly seedsRipe: boolean;
};

export const seedTanninIndexExample = {
  input: {
    ripeThreshold: 50,
    seedTanninIndex: 62,
  },
  output: {
    seedsRipe: true,
  },
} satisfies ToolExample<
  SeedTanninIndexCheckerInput,
  SeedTanninIndexCheckerOutput
>;

export const calculateSeedTanninIndex = (
  input: SeedTanninIndexCheckerInput,
): SeedTanninIndexCheckerOutput => {
  const threshold = input.ripeThreshold ?? 50;
  if (threshold <= 0)
    simpleError(
      "ripeThreshold",
      "The ripeness threshold must be positive.",
      "invalid_value",
    );
  return { seedsRipe: input.seedTanninIndex >= threshold };
};

export const seedTanninIndexCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateSeedTanninIndex(input as unknown as SeedTanninIndexCheckerInput),
  description:
    "Judge seed maturity by comparing the brown-seed tannin index against the block's ripeness threshold.",
  id: "oenology/seed-tannin-index-checker",
  inputs: [
    {
      description:
        "Seed tannin index from the harvest bench assay; browner, riper seeds score higher.",
      id: "seedTanninIndex",
      kind: "number",
      label: "Seed tannin index",
      minimum: 0,
    },
    {
      default: 50,
      description:
        "Index at or above which the seeds are counted ripe for picking decisions.",
      id: "ripeThreshold",
      kind: "number",
      label: "Ripeness threshold",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the seeds meet the ripeness threshold.",
      id: "seedsRipe",
      kind: "boolean",
      label: "Seeds ripe",
    },
  ],
  title: "Phenolic Ripeness Seed Tannin Index Checker",
});
export const runSeedTanninIndexChecker = seedTanninIndexCheckerTool.execute;
export default seedTanninIndexCheckerTool;
