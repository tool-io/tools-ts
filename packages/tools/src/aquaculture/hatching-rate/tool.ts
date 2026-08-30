import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HatchingRateInput = Readonly<{
  readonly hatchedLarvae: number;
  readonly viableEggs: number;
}>;
export type HatchingRateOutput = Readonly<{
  readonly hatchingPercent: number;
}>;

export const calculateHatchingRate = (
  x: HatchingRateInput,
): HatchingRateOutput => {
  if (
    !Number.isFinite(x.hatchedLarvae) ||
    x.hatchedLarvae < 0 ||
    !Number.isSafeInteger(x.hatchedLarvae)
  )
    simpleError("hatchedLarvae", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.viableEggs) ||
    x.viableEggs <= 0 ||
    !Number.isSafeInteger(x.viableEggs)
  )
    simpleError("viableEggs", "Provide a positive whole number.");
  if (x.hatchedLarvae > x.viableEggs)
    simpleError("hatchedLarvae", "Hatched larvae cannot exceed viable eggs.");
  const hatchingPercent = (x.hatchedLarvae / x.viableEggs) * 100;
  if (!Number.isFinite(hatchingPercent))
    simpleError(
      "hatchingPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    hatchingPercent: Object.is(hatchingPercent, -0) ? 0 : hatchingPercent,
  };
};

export const example = {
  input: {
    hatchedLarvae: 900,
    viableEggs: 1000,
  },
  output: { hatchingPercent: 90 },
} satisfies ToolExample<HatchingRateInput, HatchingRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/hatching-rate",
  title: "Hatching Rate",
  description:
    "Measure hatching success against the count of viable eggs, not all eggs laid.",
  inputs: [
    {
      id: "hatchedLarvae",
      kind: "number",
      label: "Hatched Larvae",
      unit: "larvae",
    },
    { id: "viableEggs", kind: "number", label: "Viable Eggs", unit: "eggs" },
  ],
  outputs: [
    {
      id: "hatchingPercent",
      kind: "number",
      label: "Hatching Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateHatchingRate({
      hatchedLarvae: input.hatchedLarvae as number,
      viableEggs: input.viableEggs as number,
    }),
});
export const runHatchingRate = tool.execute;
export default tool;
