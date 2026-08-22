import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RemainingRunwayInput = {
  readonly runwayLengthFt: number;
  readonly usedFt: number;
};

export type RemainingRunwayOutput = {
  readonly remainingFt: number;
};

export const remainingRunwayExample = {
  input: { runwayLengthFt: 5000, usedFt: 1800 },
  output: { remainingFt: 3200 },
} satisfies ToolExample<RemainingRunwayInput, RemainingRunwayOutput>;

export const calculateRemainingRunway = (
  input: RemainingRunwayInput,
): RemainingRunwayOutput => {
  if (input.runwayLengthFt <= 0)
    simpleError(
      "runwayLengthFt",
      "The runway length must be positive.",
      "invalid_runway",
    );
  if (input.usedFt < 0 || input.usedFt > input.runwayLengthFt)
    simpleError(
      "usedFt",
      "Used distance must be between zero and the runway length.",
      "invalid_used_distance",
    );
  return { remainingFt: input.runwayLengthFt - input.usedFt };
};

export const remainingRunwayTool = createSimpleTool({
  calculate: (input) =>
    calculateRemainingRunway(input as unknown as RemainingRunwayInput),
  description:
    "Compute the remaining runway after a given distance has been consumed.",
  id: "aviation/remaining-runway",
  inputs: [
    {
      description: "Total runway length available.",
      id: "runwayLengthFt",
      kind: "number",
      label: "Runway length",
      unit: "ft",
    },
    {
      description: "Distance already consumed on the runway.",
      id: "usedFt",
      kind: "number",
      label: "Used distance",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Runway remaining for continued roll or rejected takeoff.",
      format: "length-ft",
      id: "remainingFt",
      kind: "number",
      label: "Remaining runway",
      unit: "ft",
    },
  ],
  title: "Remaining Runway Calculator",
});
export const runRemainingRunway = remainingRunwayTool.execute;
export default remainingRunwayTool;
