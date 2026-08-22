import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OxygenDurationInput = {
  readonly flowLitersPerMinute: number;
  readonly usableOxygenLiters: number;
};

export type OxygenDurationOutput = {
  readonly durationHours: number;
};

export const oxygenDurationExample = {
  input: { flowLitersPerMinute: 6, usableOxygenLiters: 600 },
  output: { durationHours: 5 / 3 },
} satisfies ToolExample<OxygenDurationInput, OxygenDurationOutput>;

export const calculateOxygenDuration = (
  input: OxygenDurationInput,
): OxygenDurationOutput => {
  if (input.flowLitersPerMinute <= 0)
    simpleError(
      "flowLitersPerMinute",
      "The flow rate must be positive.",
      "invalid_flow",
    );
  if (input.usableOxygenLiters < 0)
    simpleError(
      "usableOxygenLiters",
      "Usable oxygen cannot be negative.",
      "invalid_volume",
    );
  const minutes = input.usableOxygenLiters / input.flowLitersPerMinute;
  return { durationHours: minutes / 60 };
};

export const oxygenDurationTool = createSimpleTool({
  calculate: (input) =>
    calculateOxygenDuration(input as unknown as OxygenDurationInput),
  description:
    "Compute how long the onboard oxygen lasts at a given crew or passenger flow rate.",
  id: "aviation/oxygen-duration",
  inputs: [
    {
      description: "Total usable oxygen volume at cylinder pressure.",
      id: "usableOxygenLiters",
      kind: "number",
      label: "Usable oxygen",
      unit: "L",
    },
    {
      description: "Consumption rate of all users combined.",
      id: "flowLitersPerMinute",
      kind: "number",
      label: "Flow rate",
      unit: "L/min",
    },
  ],
  outputs: [
    {
      description: "Oxygen endurance.",
      format: "duration-h",
      id: "durationHours",
      kind: "number",
      label: "Duration",
      unit: "h",
    },
  ],
  title: "Oxygen Duration Calculator",
});
export const runOxygenDuration = oxygenDurationTool.execute;
export default oxygenDurationTool;
