import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DewateringWellFlowInput = Readonly<{
  readonly conductivityMetersPerSecond: number;
  readonly aquiferThicknessMeters: number;
  readonly innerHeadMeters: number;
  readonly outerHeadMeters: number;
  readonly innerRadiusMeters: number;
  readonly outerRadiusMeters: number;
}>;
export type DewateringWellFlowOutput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
}>;

export const calculateDewateringWellFlow = (
  x: DewateringWellFlowInput,
): DewateringWellFlowOutput => {
  if (
    !Number.isFinite(x.conductivityMetersPerSecond) ||
    x.conductivityMetersPerSecond < 0
  )
    simpleError(
      "conductivityMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.aquiferThicknessMeters) ||
    x.aquiferThicknessMeters < 0
  )
    simpleError(
      "aquiferThicknessMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.innerHeadMeters) || x.innerHeadMeters < 0)
    simpleError("innerHeadMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outerHeadMeters) || x.outerHeadMeters < 0)
    simpleError("outerHeadMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.innerRadiusMeters) || x.innerRadiusMeters < 0)
    simpleError("innerRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outerRadiusMeters) || x.outerRadiusMeters < 0)
    simpleError("outerRadiusMeters", "Provide a finite number at least 0.");
  if (
    x.outerHeadMeters < x.innerHeadMeters ||
    x.outerRadiusMeters <= x.innerRadiusMeters
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const flowCubicMetersPerSecond =
    (2 *
      Math.PI *
      x.conductivityMetersPerSecond *
      x.aquiferThicknessMeters *
      (x.outerHeadMeters - x.innerHeadMeters)) /
    Math.log(x.outerRadiusMeters / x.innerRadiusMeters);
  if (!Number.isFinite(flowCubicMetersPerSecond))
    simpleError(
      "flowCubicMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    flowCubicMetersPerSecond: Object.is(flowCubicMetersPerSecond, -0)
      ? 0
      : flowCubicMetersPerSecond,
  };
};

export const example = {
  input: {
    conductivityMetersPerSecond: 0.0001,
    aquiferThicknessMeters: 10,
    innerHeadMeters: 5,
    outerHeadMeters: 6,
    innerRadiusMeters: 10,
    outerRadiusMeters: 100,
  },
  output: { flowCubicMetersPerSecond: 0.002728752707683682 },
} satisfies ToolExample<DewateringWellFlowInput, DewateringWellFlowOutput>;

export const tool = createSimpleTool({
  id: "engineering/dewatering-well-flow",
  title: "Dewatering Well Flow",
  description:
    "Steady radial flow to a well in a confined aquifer by the Thiem equation; uses hydraulic conductivity, saturated thickness and two observation radii.",
  inputs: [
    {
      id: "conductivityMetersPerSecond",
      kind: "number",
      label: "Conductivity Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "aquiferThicknessMeters",
      kind: "number",
      label: "Aquifer Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "innerHeadMeters",
      kind: "number",
      label: "Inner Head Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "outerHeadMeters",
      kind: "number",
      label: "Outer Head Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "innerRadiusMeters",
      kind: "number",
      label: "Inner Radius Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "outerRadiusMeters",
      kind: "number",
      label: "Outer Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
    },
  ],
  calculate: (input) =>
    calculateDewateringWellFlow({
      conductivityMetersPerSecond: input.conductivityMetersPerSecond as number,
      aquiferThicknessMeters: input.aquiferThicknessMeters as number,
      innerHeadMeters: input.innerHeadMeters as number,
      outerHeadMeters: input.outerHeadMeters as number,
      innerRadiusMeters: input.innerRadiusMeters as number,
      outerRadiusMeters: input.outerRadiusMeters as number,
    }),
});
export const dewateringWellFlowTool = tool;
export const runDewateringWellFlow = tool.execute;
export default tool;
