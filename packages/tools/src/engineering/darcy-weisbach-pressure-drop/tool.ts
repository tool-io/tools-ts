import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DarcyWeisbachPressureDropInput = Readonly<{
  readonly darcyFrictionFactor: number;
  readonly lengthMeters: number;
  readonly diameterMeters: number;
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
}>;
export type DarcyWeisbachPressureDropOutput = Readonly<{
  readonly pressureDropPascals: number;
}>;

export const calculateDarcyWeisbachPressureDrop = (
  x: DarcyWeisbachPressureDropInput,
): DarcyWeisbachPressureDropOutput => {
  if (!Number.isFinite(x.darcyFrictionFactor) || x.darcyFrictionFactor < 0)
    simpleError("darcyFrictionFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.diameterMeters) || x.diameterMeters < 0)
    simpleError("diameterMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  const pressureDropPascals =
    (((x.darcyFrictionFactor * x.lengthMeters) / x.diameterMeters) *
      x.densityKgPerM3 *
      x.speedMetersPerSecond ** 2) /
    2;
  if (!Number.isFinite(pressureDropPascals))
    simpleError(
      "pressureDropPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressureDropPascals: Object.is(pressureDropPascals, -0)
      ? 0
      : pressureDropPascals,
  };
};

export const example = {
  input: {
    darcyFrictionFactor: 0.02,
    lengthMeters: 100,
    diameterMeters: 0.1,
    densityKgPerM3: 1000,
    speedMetersPerSecond: 2,
  },
  output: { pressureDropPascals: 40000 },
} satisfies ToolExample<
  DarcyWeisbachPressureDropInput,
  DarcyWeisbachPressureDropOutput
>;

export const tool = createSimpleTool({
  id: "engineering/darcy-weisbach-pressure-drop",
  title: "Darcy Weisbach Pressure Drop",
  description:
    "Darcy–Weisbach pressure drop in a straight constant-diameter pipe from a supplied Darcy friction factor; excludes local losses.",
  inputs: [
    {
      id: "darcyFrictionFactor",
      kind: "number",
      label: "Darcy Friction Factor",
      minimum: 0,
    },
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "diameterMeters",
      kind: "number",
      label: "Diameter Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressureDropPascals",
      kind: "number",
      label: "Pressure Drop Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateDarcyWeisbachPressureDrop({
      darcyFrictionFactor: input.darcyFrictionFactor as number,
      lengthMeters: input.lengthMeters as number,
      diameterMeters: input.diameterMeters as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const darcyWeisbachPressureDropTool = tool;
export const runDarcyWeisbachPressureDrop = tool.execute;
export default tool;
