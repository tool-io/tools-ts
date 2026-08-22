import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OxygenRequiredInput = {
  readonly durationMinutes: number;
  readonly flowLitersPerMinute: number;
};

export type OxygenRequiredOutput = {
  readonly oxygenLiters: number;
};

export const oxygenRequiredExample = {
  input: { durationMinutes: 30, flowLitersPerMinute: 6 },
  output: { oxygenLiters: 180 },
} satisfies ToolExample<OxygenRequiredInput, OxygenRequiredOutput>;

export const calculateOxygenRequired = (
  input: OxygenRequiredInput,
): OxygenRequiredOutput => {
  if (input.durationMinutes < 0)
    simpleError(
      "durationMinutes",
      "The duration cannot be negative.",
      "invalid_duration",
    );
  if (input.flowLitersPerMinute <= 0)
    simpleError(
      "flowLitersPerMinute",
      "The flow rate must be positive.",
      "invalid_flow",
    );
  return { oxygenLiters: input.flowLitersPerMinute * input.durationMinutes };
};

export const oxygenRequiredTool = createSimpleTool({
  calculate: (input) =>
    calculateOxygenRequired(input as unknown as OxygenRequiredInput),
  description:
    "Compute the onboard oxygen volume required for a duration at a given combined flow rate.",
  id: "aviation/oxygen-required",
  inputs: [
    {
      description: "Duration the oxygen must last.",
      id: "durationMinutes",
      kind: "number",
      label: "Duration",
      unit: "min",
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
      description: "Required usable oxygen volume.",
      format: "volume-l",
      id: "oxygenLiters",
      kind: "number",
      label: "Oxygen required",
      unit: "L",
    },
  ],
  title: "Oxygen Required Calculator",
});
export const runOxygenRequired = oxygenRequiredTool.execute;
export default oxygenRequiredTool;
