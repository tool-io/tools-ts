import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistorVoltageRatingCheckInput = {
  readonly appliedVolts: number;
  readonly maxWorkingVolts?: number;
};

export type ResistorVoltageRatingCheckOutput = {
  readonly withinRating: boolean;
};

export const resistorVoltageRatingCheckExample = {
  input: { appliedVolts: 230 },
  output: { withinRating: true },
} satisfies ToolExample<
  ResistorVoltageRatingCheckInput,
  ResistorVoltageRatingCheckOutput
>;

export const calculateResistorVoltageRatingCheck = (
  input: ResistorVoltageRatingCheckInput,
): ResistorVoltageRatingCheckOutput => {
  if (!(input.appliedVolts > 0))
    simpleError(
      "appliedVolts",
      "Applied voltage must be positive.",
      "invalid_voltage",
    );
  const maxWorkingVolts = input.maxWorkingVolts ?? 250;
  return { withinRating: input.appliedVolts <= maxWorkingVolts };
};

export const resistorVoltageRatingCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateResistorVoltageRatingCheck(
      input as unknown as ResistorVoltageRatingCheckInput,
    ),
  description:
    "Check whether the voltage applied across a resistor is within its maximum working voltage rating, which defaults to 250 volts.",
  id: "electronics/resistor-voltage-rating-check",
  inputs: [
    {
      description: "Voltage applied across the resistor.",
      id: "appliedVolts",
      kind: "number",
      label: "Applied voltage",
      unit: "V",
    },
    {
      default: 250,
      description: "Maximum working voltage of the part.",
      id: "maxWorkingVolts",
      kind: "number",
      label: "Max working voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "True when the applied voltage does not exceed the rating.",
      id: "withinRating",
      kind: "boolean",
      label: "Within rating",
    },
  ],
  title: "Voltage Rating Check",
});
export const runResistorVoltageRatingCheck =
  resistorVoltageRatingCheckTool.execute;
export default resistorVoltageRatingCheckTool;
