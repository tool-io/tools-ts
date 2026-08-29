import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotorPowerFactorAtLoadInput = Readonly<{
  readonly realPowerW: number;
  readonly lineVoltageV: number;
  readonly lineCurrentAmperes: number;
}>;
export type MotorPowerFactorAtLoadOutput = Readonly<{ powerFactor: number }>;

export const calculateMotorPowerFactorAtLoad = (
  i: MotorPowerFactorAtLoadInput,
): MotorPowerFactorAtLoadOutput => {
  if (i.realPowerW > Math.sqrt(3) * i.lineVoltageV * i.lineCurrentAmperes)
    simpleError(
      "realPowerW",
      "Real power cannot exceed apparent power in this model.",
    );
  const value =
    i.realPowerW / (Math.sqrt(3) * i.lineVoltageV * i.lineCurrentAmperes);
  if (!Number.isFinite(value))
    simpleError("powerFactor", "The inputs produce a non-finite result.");
  return { powerFactor: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { realPowerW: 9000, lineVoltageV: 400, lineCurrentAmperes: 15 },
  output: { powerFactor: 0.8660254037844386 },
} satisfies ToolExample<
  MotorPowerFactorAtLoadInput,
  MotorPowerFactorAtLoadOutput
>;

export const tool = createSimpleTool({
  id: "electronics/motor-power-factor-at-load",
  title: "Motor Power Factor At Load",
  description:
    "Calculate balanced three-phase motor power factor as real input power divided by √3 times line voltage and line current; the result is a magnitude.",
  inputs: [
    {
      id: "realPowerW",
      kind: "number",
      label: "Real Power (W)",
      unit: "W",
      minimum: 0,
    },
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
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "powerFactor", kind: "number", label: "Power Factor" }],
  calculate: (input) =>
    calculateMotorPowerFactorAtLoad({
      realPowerW: input.realPowerW as number,
      lineVoltageV: input.lineVoltageV as number,
      lineCurrentAmperes: input.lineCurrentAmperes as number,
    }),
});
export const motorPowerFactorAtLoadTool = tool;
export const runMotorPowerFactorAtLoad = tool.execute;
export default tool;
