import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SynodicCycleDisplayInput = Readonly<{
  readonly discTeeth: number;
  readonly advancesPerDay: number;
}>;
export type SynodicCycleDisplayOutput = Readonly<{
  readonly cycleDays: number;
}>;

export const calculateSynodicCycleDisplay = (
  x: SynodicCycleDisplayInput,
): SynodicCycleDisplayOutput => {
  if (
    !Number.isFinite(x.discTeeth) ||
    !Number.isSafeInteger(x.discTeeth) ||
    x.discTeeth < 1
  )
    simpleError("discTeeth", "Provide a positive safe integer.");
  if (!Number.isFinite(x.advancesPerDay) || x.advancesPerDay <= 0)
    simpleError("advancesPerDay", "Provide a finite positive number.");
  const cycleDays = x.discTeeth / x.advancesPerDay;
  if (!Number.isFinite(cycleDays))
    simpleError(
      "cycleDays",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { cycleDays: Object.is(cycleDays, -0) ? 0 : cycleDays };
};

export const example = {
  input: {
    discTeeth: 59,
    advancesPerDay: 2,
  },
  output: { cycleDays: 29.5 },
} satisfies ToolExample<SynodicCycleDisplayInput, SynodicCycleDisplayOutput>;

export const tool = createSimpleTool({
  id: "horology/synodic-cycle-display",
  title: "Synodic Cycle Display",
  description:
    "Moon-phase display cycle in days from gear tooth count and advances per calendar day.",
  inputs: [
    { id: "discTeeth", kind: "integer", label: "Disc Teeth", minimum: 1 },
    {
      id: "advancesPerDay",
      kind: "number",
      label: "Advances Per Day",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "cycleDays", kind: "number", label: "Cycle Days", unit: "day" },
  ],
  calculate: (input) =>
    calculateSynodicCycleDisplay({
      discTeeth: input.discTeeth as number,
      advancesPerDay: input.advancesPerDay as number,
    }),
});
export const synodicCycleDisplayTool = tool;
export const runSynodicCycleDisplay = tool.execute;
export default tool;
