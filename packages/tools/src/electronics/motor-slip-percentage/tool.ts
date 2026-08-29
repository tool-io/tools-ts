import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorSlipPercentageInput = Readonly<{
  readonly synchronousSpeedRpm: number;
  readonly rotorSpeedRpm: number;
}>;
export type MotorSlipPercentageOutput = Readonly<{ slipPercent: number }>;

export const calculateMotorSlipPercentage = (
  i: MotorSlipPercentageInput,
): MotorSlipPercentageOutput => {
  if (i.rotorSpeedRpm > i.synchronousSpeedRpm)
    simpleError(
      "rotorSpeedRpm",
      "This motoring model requires rotor speed no greater than synchronous speed.",
    );
  const value =
    (100 * (i.synchronousSpeedRpm - i.rotorSpeedRpm)) / i.synchronousSpeedRpm;
  if (!Number.isFinite(value))
    simpleError("slipPercent", "The inputs produce a non-finite result.");
  return { slipPercent: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { synchronousSpeedRpm: 1500, rotorSpeedRpm: 1440 },
  output: { slipPercent: 4 },
} satisfies ToolExample<MotorSlipPercentageInput, MotorSlipPercentageOutput>;

export const tool = createSimpleTool({
  id: "electronics/motor-slip-percentage",
  title: "Motor Slip Percentage",
  description:
    "Calculate induction-motor slip as the percentage difference between synchronous and rotor speed relative to synchronous speed.",
  inputs: [
    {
      id: "synchronousSpeedRpm",
      kind: "number",
      label: "Synchronous Speed (rpm)",
      unit: "rpm",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "rotorSpeedRpm",
      kind: "number",
      label: "Rotor Speed (rpm)",
      unit: "rpm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "slipPercent", kind: "number", label: "Slip (%)", unit: "%" },
  ],
  calculate: (input) =>
    calculateMotorSlipPercentage({
      synchronousSpeedRpm: input.synchronousSpeedRpm as number,
      rotorSpeedRpm: input.rotorSpeedRpm as number,
    }),
});
export const motorSlipPercentageTool = tool;
export const runMotorSlipPercentage = tool.execute;
export default tool;
