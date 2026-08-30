import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RocketThrustInput = Readonly<{
  readonly massFlowKilogramsPerSecond: number;
  readonly exhaustSpeedMetersPerSecond: number;
  readonly exitPressurePascals: number;
  readonly ambientPressurePascals: number;
  readonly exitAreaSquareMeters: number;
}>;
export type RocketThrustOutput = Readonly<{
  readonly thrustNewtons: number;
}>;

export const calculateRocketThrust = (
  x: RocketThrustInput,
): RocketThrustOutput => {
  if (
    !Number.isFinite(x.massFlowKilogramsPerSecond) ||
    x.massFlowKilogramsPerSecond < 0
  )
    simpleError(
      "massFlowKilogramsPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.exhaustSpeedMetersPerSecond) ||
    x.exhaustSpeedMetersPerSecond < 0
  )
    simpleError(
      "exhaustSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.exitPressurePascals) || x.exitPressurePascals < 0)
    simpleError("exitPressurePascals", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.ambientPressurePascals) ||
    x.ambientPressurePascals < 0
  )
    simpleError(
      "ambientPressurePascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.exitAreaSquareMeters) || x.exitAreaSquareMeters < 0)
    simpleError("exitAreaSquareMeters", "Provide a finite number at least 0.");
  const thrustNewtons =
    x.massFlowKilogramsPerSecond * x.exhaustSpeedMetersPerSecond +
    (x.exitPressurePascals - x.ambientPressurePascals) * x.exitAreaSquareMeters;
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
    exhaustSpeedMetersPerSecond: 3000,
    exitPressurePascals: 120000,
    ambientPressurePascals: 100000,
    exitAreaSquareMeters: 0.5,
  },
  output: { thrustNewtons: 40000 },
} satisfies ToolExample<RocketThrustInput, RocketThrustOutput>;

export const tool = createSimpleTool({
  id: "engineering/rocket-thrust",
  title: "Rocket Thrust",
  description:
    "Ideal rocket thrust ṁve+(pe−pa)Ae from exhaust momentum and nozzle pressure imbalance.",
  inputs: [
    {
      id: "massFlowKilogramsPerSecond",
      kind: "number",
      label: "Mass Flow Kilograms Per Second",
      unit: "kg/s",
      minimum: 0,
    },
    {
      id: "exhaustSpeedMetersPerSecond",
      kind: "number",
      label: "Exhaust Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "exitPressurePascals",
      kind: "number",
      label: "Exit Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "ambientPressurePascals",
      kind: "number",
      label: "Ambient Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "exitAreaSquareMeters",
      kind: "number",
      label: "Exit Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "thrustNewtons", kind: "number", label: "Thrust Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculateRocketThrust({
      massFlowKilogramsPerSecond: input.massFlowKilogramsPerSecond as number,
      exhaustSpeedMetersPerSecond: input.exhaustSpeedMetersPerSecond as number,
      exitPressurePascals: input.exitPressurePascals as number,
      ambientPressurePascals: input.ambientPressurePascals as number,
      exitAreaSquareMeters: input.exitAreaSquareMeters as number,
    }),
});
export const rocketThrustTool = tool;
export const runRocketThrust = tool.execute;
export default tool;
