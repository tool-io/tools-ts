import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PropellerThrustInput = Readonly<{
  readonly massFlowKilogramsPerSecond: number;
  readonly inletSpeedMetersPerSecond: number;
  readonly outletSpeedMetersPerSecond: number;
}>;
export type PropellerThrustOutput = Readonly<{
  readonly thrustNewtons: number;
}>;

export const calculatePropellerThrust = (
  x: PropellerThrustInput,
): PropellerThrustOutput => {
  if (
    !Number.isFinite(x.massFlowKilogramsPerSecond) ||
    x.massFlowKilogramsPerSecond < 0
  )
    simpleError(
      "massFlowKilogramsPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.inletSpeedMetersPerSecond) ||
    x.inletSpeedMetersPerSecond < 0
  )
    simpleError(
      "inletSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.outletSpeedMetersPerSecond) ||
    x.outletSpeedMetersPerSecond < 0
  )
    simpleError(
      "outletSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (x.outletSpeedMetersPerSecond < x.inletSpeedMetersPerSecond)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const thrustNewtons =
    x.massFlowKilogramsPerSecond *
    (x.outletSpeedMetersPerSecond - x.inletSpeedMetersPerSecond);
  if (!Number.isFinite(thrustNewtons))
    simpleError(
      "thrustNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { thrustNewtons: Object.is(thrustNewtons, -0) ? 0 : thrustNewtons };
};

export const example = {
  input: {
    massFlowKilogramsPerSecond: 10,
    inletSpeedMetersPerSecond: 5,
    outletSpeedMetersPerSecond: 15,
  },
  output: { thrustNewtons: 100 },
} satisfies ToolExample<PropellerThrustInput, PropellerThrustOutput>;

export const tool = createSimpleTool({
  id: "engineering/propeller-thrust",
  title: "Propeller Thrust",
  description:
    "Axial thrust from ideal momentum change ṁ(vout−vin) through a propeller control volume; excludes pressure thrust.",
  inputs: [
    {
      id: "massFlowKilogramsPerSecond",
      kind: "number",
      label: "Mass Flow Kilograms Per Second",
      unit: "kg/s",
      minimum: 0,
    },
    {
      id: "inletSpeedMetersPerSecond",
      kind: "number",
      label: "Inlet Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "outletSpeedMetersPerSecond",
      kind: "number",
      label: "Outlet Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "thrustNewtons", kind: "number", label: "Thrust Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculatePropellerThrust({
      massFlowKilogramsPerSecond: input.massFlowKilogramsPerSecond as number,
      inletSpeedMetersPerSecond: input.inletSpeedMetersPerSecond as number,
      outletSpeedMetersPerSecond: input.outletSpeedMetersPerSecond as number,
    }),
});
export const propellerThrustTool = tool;
export const runPropellerThrust = tool.execute;
export default tool;
