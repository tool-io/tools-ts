import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrikeTrainEnergyInput = Readonly<{
  readonly strikeCount: number;
  readonly joulesPerStrike: number;
}>;
export type StrikeTrainEnergyOutput = Readonly<{
  readonly totalJoules: number;
}>;

export const calculateStrikeTrainEnergy = (
  x: StrikeTrainEnergyInput,
): StrikeTrainEnergyOutput => {
  if (!Number.isFinite(x.strikeCount) || x.strikeCount < 0)
    simpleError("strikeCount", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.joulesPerStrike) || x.joulesPerStrike < 0)
    simpleError("joulesPerStrike", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.strikeCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const totalJoules = x.strikeCount * x.joulesPerStrike;
  if (!Number.isFinite(totalJoules))
    simpleError(
      "totalJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalJoules: Object.is(totalJoules, -0) ? 0 : totalJoules };
};

export const example = {
  input: {
    strikeCount: 10,
    joulesPerStrike: 0.1,
  },
  output: { totalJoules: 1 },
} satisfies ToolExample<StrikeTrainEnergyInput, StrikeTrainEnergyOutput>;

export const tool = createSimpleTool({
  id: "horology/strike-train-energy",
  title: "Strike Train Energy",
  description:
    "Mechanical energy spent on strikes from count and energy used per strike.",
  inputs: [
    { id: "strikeCount", kind: "number", label: "Strike Count", minimum: 0 },
    {
      id: "joulesPerStrike",
      kind: "number",
      label: "Joules Per Strike",
      unit: "J",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "totalJoules", kind: "number", label: "Total Joules", unit: "J" },
  ],
  calculate: (input) =>
    calculateStrikeTrainEnergy({
      strikeCount: input.strikeCount as number,
      joulesPerStrike: input.joulesPerStrike as number,
    }),
});
export const strikeTrainEnergyTool = tool;
export const runStrikeTrainEnergy = tool.execute;
export default tool;
