import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlipDiscRateInput = Readonly<{
  readonly discPositions: number;
  readonly cycleMinutes: number;
}>;
export type FlipDiscRateOutput = Readonly<{
  readonly advancesPerMinute: number;
}>;

export const calculateFlipDiscRate = (
  x: FlipDiscRateInput,
): FlipDiscRateOutput => {
  if (
    !Number.isFinite(x.discPositions) ||
    !Number.isSafeInteger(x.discPositions) ||
    x.discPositions < 1
  )
    simpleError("discPositions", "Provide a positive safe integer.");
  if (!Number.isFinite(x.cycleMinutes) || x.cycleMinutes <= 0)
    simpleError("cycleMinutes", "Provide a finite positive number.");
  const advancesPerMinute = x.discPositions / x.cycleMinutes;
  if (!Number.isFinite(advancesPerMinute))
    simpleError(
      "advancesPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    advancesPerMinute: Object.is(advancesPerMinute, -0) ? 0 : advancesPerMinute,
  };
};

export const example = {
  input: {
    discPositions: 60,
    cycleMinutes: 60,
  },
  output: { advancesPerMinute: 1 },
} satisfies ToolExample<FlipDiscRateInput, FlipDiscRateOutput>;

export const tool = createSimpleTool({
  id: "horology/flip-disc-rate",
  title: "Flip Disc Rate",
  description:
    "Flip-disc advances per minute from total disc positions and one complete cycle duration.",
  inputs: [
    {
      id: "discPositions",
      kind: "integer",
      label: "Disc Positions",
      minimum: 1,
    },
    {
      id: "cycleMinutes",
      kind: "number",
      label: "Cycle Minutes",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "advancesPerMinute",
      kind: "number",
      label: "Advances Per Minute",
      unit: "1/min",
    },
  ],
  calculate: (input) =>
    calculateFlipDiscRate({
      discPositions: input.discPositions as number,
      cycleMinutes: input.cycleMinutes as number,
    }),
});
export const flipDiscRateTool = tool;
export const runFlipDiscRate = tool.execute;
export default tool;
