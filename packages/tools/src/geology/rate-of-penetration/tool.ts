import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RateOfPenetrationInput = {
  readonly drillingTimeMinutes: number;
  readonly metresDrilled: number;
};

export type RateOfPenetrationOutput = {
  readonly rateOfPenetrationMetresPerHour: number;
};

export const calculateRateOfPenetration = (
  input: RateOfPenetrationInput,
): RateOfPenetrationOutput => {
  if (!(input.metresDrilled > 0))
    return simpleError(
      "metresDrilled",
      "Drilled interval must be greater than zero.",
      "invalid_distance",
    );
  if (!(input.drillingTimeMinutes > 0))
    return simpleError(
      "drillingTimeMinutes",
      "Drilling time must be greater than zero.",
      "invalid_time",
    );
  return {
    rateOfPenetrationMetresPerHour:
      input.metresDrilled / (input.drillingTimeMinutes / 60),
  };
};

export const rateOfPenetrationExample = {
  input: { drillingTimeMinutes: 45, metresDrilled: 30 },
  output: { rateOfPenetrationMetresPerHour: 40 },
} satisfies ToolExample<RateOfPenetrationInput, RateOfPenetrationOutput>;

export const rateOfPenetrationTool = createSimpleTool({
  id: "geology/rate-of-penetration",
  title: "Rate Of Penetration Calculator",
  description:
    "Compute drilling rate of penetration in metres per hour from drilled length and elapsed time.",
  inputs: [
    {
      description: "Duration of the drilling interval in minutes.",
      id: "drillingTimeMinutes",
      kind: "number",
      label: "Drilling time",
    },
    {
      description: "Length drilled in metres.",
      id: "metresDrilled",
      kind: "number",
      label: "Metres drilled",
    },
  ],
  outputs: [
    {
      description: "Rate of penetration in metres per hour.",
      id: "rateOfPenetrationMetresPerHour",
      kind: "number",
      label: "ROP",
    },
  ],
  calculate: (input) =>
    calculateRateOfPenetration(input as unknown as RateOfPenetrationInput),
});

export const runRateOfPenetration = rateOfPenetrationTool.execute;
export default rateOfPenetrationTool;
