import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcMotorReactivePowerInput = Readonly<{
  readonly lineVoltageV: number;
  readonly lineCurrentAmperes: number;
  readonly powerFactor: number;
}>;
export type AcMotorReactivePowerOutput = Readonly<{ reactivePowerVar: number }>;

export const calculateAcMotorReactivePower = (
  i: AcMotorReactivePowerInput,
): AcMotorReactivePowerOutput => {
  const value =
    Math.sqrt(3) *
    i.lineVoltageV *
    i.lineCurrentAmperes *
    Math.sqrt(Math.max(0, 1 - i.powerFactor ** 2));
  if (!Number.isFinite(value))
    simpleError("reactivePowerVar", "The inputs produce a non-finite result.");
  return { reactivePowerVar: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { lineVoltageV: 400, lineCurrentAmperes: 10, powerFactor: 0.8 },
  output: { reactivePowerVar: 4156.921938165305 },
} satisfies ToolExample<AcMotorReactivePowerInput, AcMotorReactivePowerOutput>;

export const tool = createSimpleTool({
  id: "electronics/ac-motor-reactive-power",
  title: "Ac Motor Reactive Power",
  description:
    "Calculate positive reactive-power magnitude for a balanced three-phase motor from line voltage, line current, and power factor.",
  inputs: [
    {
      id: "lineVoltageV",
      kind: "number",
      label: "Line (V)",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "lineCurrentAmperes",
      kind: "number",
      label: "Line Current (A)",
      unit: "A",
      minimum: 0,
    },
    {
      id: "powerFactor",
      kind: "number",
      label: "Power Factor",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "reactivePowerVar", kind: "number", label: "Reactive Power Var" },
  ],
  calculate: (input) =>
    calculateAcMotorReactivePower({
      lineVoltageV: input.lineVoltageV as number,
      lineCurrentAmperes: input.lineCurrentAmperes as number,
      powerFactor: input.powerFactor as number,
    }),
});
export const acMotorReactivePowerTool = tool;
export const runAcMotorReactivePower = tool.execute;
export default tool;
