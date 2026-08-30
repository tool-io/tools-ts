import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BernoulliTotalHeadInput = Readonly<{
  readonly elevationMeters: number;
  readonly pressurePascals: number;
  readonly densityKgPerM3: number;
  readonly speedMetersPerSecond: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type BernoulliTotalHeadOutput = Readonly<{
  readonly totalHeadMeters: number;
}>;

export const calculateBernoulliTotalHead = (
  x: BernoulliTotalHeadInput,
): BernoulliTotalHeadOutput => {
  if (!Number.isFinite(x.elevationMeters))
    simpleError("elevationMeters", "Provide a finite number.");
  if (!Number.isFinite(x.pressurePascals))
    simpleError("pressurePascals", "Provide a finite number.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const totalHeadMeters =
    x.elevationMeters +
    x.pressurePascals / (x.densityKgPerM3 * x.gravityMetersPerSecondSquared) +
    x.speedMetersPerSecond ** 2 / (2 * x.gravityMetersPerSecondSquared);
  if (!Number.isFinite(totalHeadMeters))
    simpleError(
      "totalHeadMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalHeadMeters: Object.is(totalHeadMeters, -0) ? 0 : totalHeadMeters,
  };
};

export const example = {
  input: {
    elevationMeters: 3,
    pressurePascals: 98100,
    densityKgPerM3: 1000,
    speedMetersPerSecond: 2,
    gravityMetersPerSecondSquared: 9.81,
  },
  output: { totalHeadMeters: 13.203873598369011 },
} satisfies ToolExample<BernoulliTotalHeadInput, BernoulliTotalHeadOutput>;

export const tool = createSimpleTool({
  id: "engineering/bernoulli-total-head",
  title: "Bernoulli Total Head",
  description:
    "Total ideal-flow head as elevation plus pressure head and velocity head; excludes friction and pump terms.",
  inputs: [
    {
      id: "elevationMeters",
      kind: "number",
      label: "Elevation Meters",
      unit: "m",
    },
    {
      id: "pressurePascals",
      kind: "number",
      label: "Pressure Pascals",
      unit: "Pa",
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
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalHeadMeters",
      kind: "number",
      label: "Total Head Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateBernoulliTotalHead({
      elevationMeters: input.elevationMeters as number,
      pressurePascals: input.pressurePascals as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const bernoulliTotalHeadTool = tool;
export const runBernoulliTotalHead = tool.execute;
export default tool;
