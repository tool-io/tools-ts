import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HagenPoiseuilleDropInput = Readonly<{
  readonly viscosityPascalSeconds: number;
  readonly lengthMeters: number;
  readonly flowCubicMetersPerSecond: number;
  readonly radiusMeters: number;
}>;
export type HagenPoiseuilleDropOutput = Readonly<{
  readonly pressureDropPascals: number;
}>;

export const calculateHagenPoiseuilleDrop = (
  x: HagenPoiseuilleDropInput,
): HagenPoiseuilleDropOutput => {
  if (
    !Number.isFinite(x.viscosityPascalSeconds) ||
    x.viscosityPascalSeconds < 0
  )
    simpleError(
      "viscosityPascalSeconds",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.flowCubicMetersPerSecond) ||
    x.flowCubicMetersPerSecond < 0
  )
    simpleError(
      "flowCubicMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.radiusMeters) || x.radiusMeters < 0)
    simpleError("radiusMeters", "Provide a finite number at least 0.");
  const pressureDropPascals =
    (8 *
      x.viscosityPascalSeconds *
      x.lengthMeters *
      x.flowCubicMetersPerSecond) /
    (Math.PI * x.radiusMeters ** 4);
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
    viscosityPascalSeconds: 0.001,
    lengthMeters: 5,
    flowCubicMetersPerSecond: 0.0001,
    radiusMeters: 0.01,
  },
  output: { pressureDropPascals: 127.3239544735163 },
} satisfies ToolExample<HagenPoiseuilleDropInput, HagenPoiseuilleDropOutput>;

export const tool = createSimpleTool({
  id: "engineering/hagen-poiseuille-drop",
  title: "Hagen Poiseuille Drop",
  description:
    "Laminar pressure drop through a straight circular tube by Hagen–Poiseuille; assumes fully developed Newtonian flow.",
  inputs: [
    {
      id: "viscosityPascalSeconds",
      kind: "number",
      label: "Viscosity Pascal Seconds",
      unit: "Pa·s",
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
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
      minimum: 0,
    },
    {
      id: "radiusMeters",
      kind: "number",
      label: "Radius Meters",
      unit: "m",
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
    calculateHagenPoiseuilleDrop({
      viscosityPascalSeconds: input.viscosityPascalSeconds as number,
      lengthMeters: input.lengthMeters as number,
      flowCubicMetersPerSecond: input.flowCubicMetersPerSecond as number,
      radiusMeters: input.radiusMeters as number,
    }),
});
export const hagenPoiseuilleDropTool = tool;
export const runHagenPoiseuilleDrop = tool.execute;
export default tool;
