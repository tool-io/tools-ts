import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DuctPressureLossInput = Readonly<{
  readonly darcyFrictionFactor: number;
  readonly lengthMeters: number;
  readonly hydraulicDiameterMeters: number;
  readonly densityKgPerM3: number;
  readonly velocityMetersPerSecond: number;
}>;
export type DuctPressureLossOutput = Readonly<{
  readonly pressureLossPascals: number;
}>;

export const calculateDuctPressureLoss = (
  x: DuctPressureLossInput,
): DuctPressureLossOutput => {
  if (!Number.isFinite(x.darcyFrictionFactor) || x.darcyFrictionFactor < 0)
    simpleError("darcyFrictionFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.hydraulicDiameterMeters) ||
    x.hydraulicDiameterMeters < 0
  )
    simpleError(
      "hydraulicDiameterMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.velocityMetersPerSecond) ||
    x.velocityMetersPerSecond < 0
  )
    simpleError(
      "velocityMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  const pressureLossPascals =
    (((x.darcyFrictionFactor * x.lengthMeters) / x.hydraulicDiameterMeters) *
      x.densityKgPerM3 *
      x.velocityMetersPerSecond ** 2) /
    2;
  if (!Number.isFinite(pressureLossPascals))
    simpleError(
      "pressureLossPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressureLossPascals: Object.is(pressureLossPascals, -0)
      ? 0
      : pressureLossPascals,
  };
};

export const example = {
  input: {
    darcyFrictionFactor: 0.02,
    lengthMeters: 10,
    hydraulicDiameterMeters: 0.2,
    densityKgPerM3: 1.2,
    velocityMetersPerSecond: 5,
  },
  output: { pressureLossPascals: 15 },
} satisfies ToolExample<DuctPressureLossInput, DuctPressureLossOutput>;

export const tool = createSimpleTool({
  id: "engineering/duct-pressure-loss",
  title: "Duct Pressure Loss",
  description:
    "Straight-duct Darcy friction pressure loss f(L/Dh)(ρv²/2) with supplied friction factor and hydraulic diameter; excludes fittings.",
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
      id: "hydraulicDiameterMeters",
      kind: "number",
      label: "Hydraulic Diameter Meters",
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
      id: "velocityMetersPerSecond",
      kind: "number",
      label: "Velocity Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressureLossPascals",
      kind: "number",
      label: "Pressure Loss Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateDuctPressureLoss({
      darcyFrictionFactor: input.darcyFrictionFactor as number,
      lengthMeters: input.lengthMeters as number,
      hydraulicDiameterMeters: input.hydraulicDiameterMeters as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      velocityMetersPerSecond: input.velocityMetersPerSecond as number,
    }),
});
export const ductPressureLossTool = tool;
export const runDuctPressureLoss = tool.execute;
export default tool;
