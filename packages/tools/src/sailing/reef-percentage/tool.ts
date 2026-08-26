import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReefPercentageInput = {
  readonly fullAreaM2: number;
  readonly reefedAreaM2: number;
};

export type ReefPercentageOutput = {
  readonly reefPercentage: number;
};

export const reefPercentageExample = {
  input: { fullAreaM2: 50, reefedAreaM2: 12.5 },
  output: { reefPercentage: 75 },
} satisfies ToolExample<ReefPercentageInput, ReefPercentageOutput>;

export const calculateReefPercentage = (
  input: ReefPercentageInput,
): ReefPercentageOutput => {
  if (input.fullAreaM2 <= 0)
    simpleError(
      "fullAreaM2",
      "The full sail area must be positive.",
      "invalid_area",
    );
  if (input.reefedAreaM2 < 0 || input.reefedAreaM2 > input.fullAreaM2)
    simpleError(
      "reefedAreaM2",
      "The reefed area must be between zero and the full sail area.",
      "invalid_reefed_area",
    );
  return {
    reefPercentage: (1 - input.reefedAreaM2 / input.fullAreaM2) * 100,
  };
};

export const reefPercentageTool = createSimpleTool({
  calculate: (input) =>
    calculateReefPercentage(input as unknown as ReefPercentageInput),
  description:
    "Compute the percentage of sail area reduced when sailing on a reefed headsail or mainsail.",
  id: "sailing/reef-percentage",
  inputs: [
    {
      description: "Total unbattened sail area before reefing.",
      id: "fullAreaM2",
      kind: "number",
      label: "Full sail area",
      minimum: 0,
      unit: "m2",
    },
    {
      description: "Remaining sail area after reefing.",
      id: "reefedAreaM2",
      kind: "number",
      label: "Reefed sail area",
      minimum: 0,
      unit: "m2",
    },
  ],
  outputs: [
    {
      description: "Fraction of sail area reduced by reefing.",
      format: "percent",
      id: "reefPercentage",
      kind: "number",
      label: "Reef percentage",
      unit: "%",
    },
  ],
  title: "Reef Percentage Calculator",
});
export const runReefPercentage = reefPercentageTool.execute;
export default reefPercentageTool;
