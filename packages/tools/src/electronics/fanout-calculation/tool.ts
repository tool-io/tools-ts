import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FanoutCalculationInput = {
  readonly driveCurrentMa: number;
  readonly inputCurrentMa: number;
};

export type FanoutCalculationOutput = {
  readonly maxFanout: number;
};

export const fanoutCalculationExample = {
  input: { driveCurrentMa: 24, inputCurrentMa: 5 },
  output: { maxFanout: 4 },
} satisfies ToolExample<FanoutCalculationInput, FanoutCalculationOutput>;

export const calculateFanoutCalculation = (
  input: FanoutCalculationInput,
): FanoutCalculationOutput => {
  if (!(input.driveCurrentMa > 0))
    simpleError(
      "driveCurrentMa",
      "Drive current must be positive.",
      "invalid_drive_current_ma",
    );
  if (!(input.inputCurrentMa > 0))
    simpleError(
      "inputCurrentMa",
      "Input current must be positive.",
      "invalid_input_current_ma",
    );
  return { maxFanout: Math.floor(input.driveCurrentMa / input.inputCurrentMa) };
};

export const fanoutCalculationTool = createSimpleTool({
  calculate: (input) =>
    calculateFanoutCalculation(input as unknown as FanoutCalculationInput),
  description:
    "Compute the maximum logic fanout as floor(drive current / input current).",
  id: "electronics/fanout-calculation",
  inputs: [
    {
      id: "driveCurrentMa",
      kind: "number",
      label: "Drive current",
      unit: "mA",
    },
    {
      id: "inputCurrentMa",
      kind: "number",
      label: "Input current",
      unit: "mA",
    },
  ],
  outputs: [{ id: "maxFanout", kind: "integer", label: "Maximum fanout" }],
  title: "Logic Fanout",
});
export const runFanoutCalculation = fanoutCalculationTool.execute;
export default fanoutCalculationTool;
