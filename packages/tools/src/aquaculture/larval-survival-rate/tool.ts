import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LarvalSurvivalRateInput = Readonly<{
  readonly survivingLarvae: number;
  readonly initialLarvae: number;
}>;
export type LarvalSurvivalRateOutput = Readonly<{
  readonly larvalSurvivalPercent: number;
}>;

export const calculateLarvalSurvivalRate = (
  x: LarvalSurvivalRateInput,
): LarvalSurvivalRateOutput => {
  if (
    !Number.isFinite(x.survivingLarvae) ||
    x.survivingLarvae < 0 ||
    !Number.isSafeInteger(x.survivingLarvae)
  )
    simpleError("survivingLarvae", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.initialLarvae) ||
    x.initialLarvae <= 0 ||
    !Number.isSafeInteger(x.initialLarvae)
  )
    simpleError("initialLarvae", "Provide a positive whole number.");
  if (x.survivingLarvae > x.initialLarvae)
    simpleError("survivingLarvae", "Survivors cannot exceed initial larvae.");
  const larvalSurvivalPercent = (x.survivingLarvae / x.initialLarvae) * 100;
  if (!Number.isFinite(larvalSurvivalPercent))
    simpleError(
      "larvalSurvivalPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    larvalSurvivalPercent: Object.is(larvalSurvivalPercent, -0)
      ? 0
      : larvalSurvivalPercent,
  };
};

export const example = {
  input: {
    survivingLarvae: 500,
    initialLarvae: 1000,
  },
  output: { larvalSurvivalPercent: 50 },
} satisfies ToolExample<LarvalSurvivalRateInput, LarvalSurvivalRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/larval-survival-rate",
  title: "Larval Survival Rate",
  description: "Measure larval survival over a specified observation interval.",
  inputs: [
    {
      id: "survivingLarvae",
      kind: "number",
      label: "Surviving Larvae",
      unit: "larvae",
    },
    {
      id: "initialLarvae",
      kind: "number",
      label: "Initial Larvae",
      unit: "larvae",
    },
  ],
  outputs: [
    {
      id: "larvalSurvivalPercent",
      kind: "number",
      label: "Larval Survival Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateLarvalSurvivalRate({
      survivingLarvae: input.survivingLarvae as number,
      initialLarvae: input.initialLarvae as number,
    }),
});
export const runLarvalSurvivalRate = tool.execute;
export default tool;
