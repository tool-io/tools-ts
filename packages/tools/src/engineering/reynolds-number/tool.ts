import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReynoldsNumberInput = Readonly<{
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
  readonly diameterMeters: number;
  readonly viscosityPascalSeconds: number;
}>;
export type ReynoldsNumberOutput = Readonly<{
  readonly reynoldsNumber: number;
}>;

export const calculateReynoldsNumber = (
  x: ReynoldsNumberInput,
): ReynoldsNumberOutput => {
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.diameterMeters) || x.diameterMeters < 0)
    simpleError("diameterMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.viscosityPascalSeconds) ||
    x.viscosityPascalSeconds < 0
  )
    simpleError(
      "viscosityPascalSeconds",
      "Provide a finite number at least 0.",
    );
  const reynoldsNumber =
    (x.densityKgPerM3 * x.speedMetersPerSecond * x.diameterMeters) /
    x.viscosityPascalSeconds;
  if (!Number.isFinite(reynoldsNumber))
    simpleError(
      "reynoldsNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { reynoldsNumber: Object.is(reynoldsNumber, -0) ? 0 : reynoldsNumber };
};

export const example = {
  input: {
    densityKgPerM3: 1000,
    speedMetersPerSecond: 2,
    diameterMeters: 0.1,
    viscosityPascalSeconds: 0.001,
  },
  output: { reynoldsNumber: 200000 },
} satisfies ToolExample<ReynoldsNumberInput, ReynoldsNumberOutput>;

export const tool = createSimpleTool({
  id: "engineering/reynolds-number",
  title: "Reynolds Number",
  description:
    "Reynolds number for internal flow from density, mean speed, hydraulic diameter and dynamic viscosity.",
  inputs: [
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
    {
      id: "diameterMeters",
      kind: "number",
      label: "Diameter Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "viscosityPascalSeconds",
      kind: "number",
      label: "Viscosity Pascal Seconds",
      unit: "Pa·s",
      minimum: 0,
    },
  ],
  outputs: [{ id: "reynoldsNumber", kind: "number", label: "Reynolds Number" }],
  calculate: (input) =>
    calculateReynoldsNumber({
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      diameterMeters: input.diameterMeters as number,
      viscosityPascalSeconds: input.viscosityPascalSeconds as number,
    }),
});
export const reynoldsNumberTool = tool;
export const runReynoldsNumber = tool.execute;
export default tool;
