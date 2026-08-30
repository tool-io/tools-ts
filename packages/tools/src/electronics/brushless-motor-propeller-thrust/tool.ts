import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrushlessMotorPropellerThrustInput = Readonly<{
  readonly thrustCoefficient: number;
  readonly airDensityKgPerM3: number;
  readonly revolutionsPerSecond: number;
  readonly diameterMeters: number;
}>;
export type BrushlessMotorPropellerThrustOutput = Readonly<{
  readonly thrustNewtons: number;
}>;

export const calculateBrushlessMotorPropellerThrust = (
  x: BrushlessMotorPropellerThrustInput,
): BrushlessMotorPropellerThrustOutput => {
  if (!Number.isFinite(x.thrustCoefficient) || x.thrustCoefficient < 0)
    simpleError("thrustCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.airDensityKgPerM3) || x.airDensityKgPerM3 < 0)
    simpleError("airDensityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.revolutionsPerSecond) || x.revolutionsPerSecond < 0)
    simpleError("revolutionsPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.diameterMeters) || x.diameterMeters < 0)
    simpleError("diameterMeters", "Provide a finite number at least 0.");
  const thrustNewtons =
    x.thrustCoefficient *
    x.airDensityKgPerM3 *
    x.revolutionsPerSecond ** 2 *
    x.diameterMeters ** 4;
  if (!Number.isFinite(thrustNewtons))
    simpleError(
      "thrustNewtons",
      "Inputs produce an undefined or non-finite result.",
    );
  return { thrustNewtons: Object.is(thrustNewtons, -0) ? 0 : thrustNewtons };
};

export const example = {
  input: {
    thrustCoefficient: 0.1,
    airDensityKgPerM3: 1.225,
    revolutionsPerSecond: 100,
    diameterMeters: 0.25,
  },
  output: { thrustNewtons: 4.785156250000001 },
} satisfies ToolExample<
  BrushlessMotorPropellerThrustInput,
  BrushlessMotorPropellerThrustOutput
>;

export const tool = createSimpleTool({
  id: "electronics/brushless-motor-propeller-thrust",
  title: "Brushless Motor Propeller Thrust",
  description:
    "Static propeller thrust from a supplied thrust coefficient, air density, rev/s and diameter; coefficient must match the propeller and operating point.",
  inputs: [
    {
      id: "thrustCoefficient",
      kind: "number",
      label: "Thrust Coefficient",
      minimum: 0,
    },
    {
      id: "airDensityKgPerM3",
      kind: "number",
      label: "Air Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "revolutionsPerSecond",
      kind: "number",
      label: "Revolutions Per Second",
      unit: "rev/s",
      minimum: 0,
    },
    {
      id: "diameterMeters",
      kind: "number",
      label: "Diameter Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "thrustNewtons", kind: "number", label: "Thrust Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculateBrushlessMotorPropellerThrust({
      thrustCoefficient: input.thrustCoefficient as number,
      airDensityKgPerM3: input.airDensityKgPerM3 as number,
      revolutionsPerSecond: input.revolutionsPerSecond as number,
      diameterMeters: input.diameterMeters as number,
    }),
});
export const brushlessMotorPropellerThrustTool = tool;
export const runBrushlessMotorPropellerThrust = tool.execute;
export default tool;
