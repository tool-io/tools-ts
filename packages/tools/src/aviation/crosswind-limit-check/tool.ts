import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrosswindLimitCheckInput = {
  readonly crosswindKt: number;
  readonly maxDemonstratedCrosswindKt: number;
};

export type CrosswindLimitCheckOutput = {
  readonly marginKt: number;
  readonly withinLimits: boolean;
};

export const crosswindLimitCheckExample = {
  input: {
    crosswindKt: 15,
    maxDemonstratedCrosswindKt: 20,
  },
  output: { marginKt: 5, withinLimits: true },
} satisfies ToolExample<CrosswindLimitCheckInput, CrosswindLimitCheckOutput>;

export const calculateCrosswindLimit = (
  input: CrosswindLimitCheckInput,
): CrosswindLimitCheckOutput => {
  if (input.crosswindKt < 0 || input.maxDemonstratedCrosswindKt <= 0)
    simpleError(
      "maxDemonstratedCrosswindKt",
      "Provide a positive crosswind and a positive limit.",
      "invalid_input",
    );
  return {
    marginKt:
      Math.round((input.maxDemonstratedCrosswindKt - input.crosswindKt) * 1e9) /
      1e9,
    withinLimits: input.crosswindKt <= input.maxDemonstratedCrosswindKt,
  };
};

export const crosswindLimitCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateCrosswindLimit(input as unknown as CrosswindLimitCheckInput),
  description:
    "Compare a crosswind against the aircraft's maximum demonstrated crosswind.",
  id: "aviation/crosswind-limit-check",
  inputs: [
    {
      description: "Actual crosswind component.",
      id: "crosswindKt",
      kind: "number",
      label: "Crosswind",
      unit: "kt",
      minimum: 0,
    },
    {
      description: "Maximum demonstrated crosswind for the aircraft.",
      id: "maxDemonstratedCrosswindKt",
      kind: "number",
      label: "Crosswind limit",
      unit: "kt",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the crosswind is within the demonstrated limit.",
      id: "withinLimits",
      kind: "boolean",
      label: "Within limits",
    },
    {
      description:
        "Signed difference between limit and actual crosswind, in knots.",
      format: "speed",
      id: "marginKt",
      kind: "number",
      label: "Margin",
      unit: "kt",
    },
  ],
  title: "Crosswind Limit Checker",
});
export const runCrosswindLimitCheck = crosswindLimitCheckTool.execute;
export default crosswindLimitCheckTool;
