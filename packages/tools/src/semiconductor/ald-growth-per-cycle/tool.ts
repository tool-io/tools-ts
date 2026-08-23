import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AldGrowthPerCycleInput = {
  readonly cycleCount: number;
  readonly totalThicknessNm: number;
};

export type AldGrowthPerCycleOutput = {
  readonly growthNmPerCycle: number;
};

export const aldGrowthPerCycleExample = {
  input: { cycleCount: 500, totalThicknessNm: 50 },
  output: { growthNmPerCycle: 0.1 },
} satisfies ToolExample<AldGrowthPerCycleInput, AldGrowthPerCycleOutput>;

export const calculateAldGrowthPerCycle = (
  input: AldGrowthPerCycleInput,
): AldGrowthPerCycleOutput => {
  if (!Number.isFinite(input.totalThicknessNm) || input.totalThicknessNm < 0)
    simpleError(
      "totalThicknessNm",
      "Total thickness must be a finite number at least 0.",
      "invalid_total_thickness",
    );
  if (!Number.isSafeInteger(input.cycleCount) || input.cycleCount < 1)
    simpleError(
      "cycleCount",
      "Cycle count must be an integer of at least one.",
      "invalid_cycle_count",
    );
  const growthNmPerCycle =
    input.totalThicknessNm === 0
      ? 0
      : input.totalThicknessNm / input.cycleCount;
  if (
    !Number.isFinite(growthNmPerCycle) ||
    (input.totalThicknessNm > 0 && growthNmPerCycle === 0)
  )
    simpleError(
      "cycleCount",
      "Growth per cycle is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    growthNmPerCycle: growthNmPerCycle === 0 ? 0 : growthNmPerCycle,
  };
};

export const aldGrowthPerCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateAldGrowthPerCycle({
      cycleCount: input.cycleCount as number,
      totalThicknessNm: input.totalThicknessNm as number,
    }),
  description:
    "Divide the total ALD film thickness (final minus initial) by the number of cycles to get the average growth per cycle.",
  id: "semiconductor/ald-growth-per-cycle",
  inputs: [
    {
      description:
        "Total ALD film thickness after all cycles. Must be at least 0 nm; 0 yields 0 nm/cycle.",
      format: "length",
      id: "totalThicknessNm",
      kind: "number",
      label: "Total thickness",
      minimum: 0,
      unit: "nm",
    },
    {
      description:
        "Number of completed ALD cycles. Must be an integer at least 1.",
      format: "count",
      id: "cycleCount",
      kind: "integer",
      label: "Cycle count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Average ALD growth per cycle over the measured cycles.",
      format: "length",
      id: "growthNmPerCycle",
      kind: "number",
      label: "Growth per cycle",
      minimum: 0,
      unit: "nm/cycle",
    },
  ],
  title: "ALD Growth Per Cycle Calculator",
});
export const runAldGrowthPerCycle = aldGrowthPerCycleTool.execute;
export default aldGrowthPerCycleTool;
