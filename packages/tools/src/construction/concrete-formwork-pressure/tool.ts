import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteFormworkPressureInput = Readonly<{
  readonly freshDensityKgPerM3: number;
  readonly depthMeters: number;
}>;
export type ConcreteFormworkPressureOutput = Readonly<{
  readonly pressureKilopascals: number;
}>;

export const calculateConcreteFormworkPressure = (
  x: ConcreteFormworkPressureInput,
): ConcreteFormworkPressureOutput => {
  if (!Number.isFinite(x.freshDensityKgPerM3) || x.freshDensityKgPerM3 < 0)
    simpleError("freshDensityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.depthMeters) || x.depthMeters < 0)
    simpleError("depthMeters", "Provide a finite number at least 0.");
  const pressureKilopascals =
    (x.freshDensityKgPerM3 * 9.80665 * x.depthMeters) / 1000;
  if (!Number.isFinite(pressureKilopascals))
    simpleError(
      "pressureKilopascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressureKilopascals: Object.is(pressureKilopascals, -0)
      ? 0
      : pressureKilopascals,
  };
};

export const example = {
  input: { freshDensityKgPerM3: 2400, depthMeters: 3 },
  output: { pressureKilopascals: 70.60788000000001 },
} satisfies ToolExample<
  ConcreteFormworkPressureInput,
  ConcreteFormworkPressureOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-formwork-pressure",
  title: "Concrete Formwork Pressure",
  description:
    "Hydrostatic upper-bound fresh-concrete pressure at a chosen depth from density and gravity; actual placement-pressure rules may differ.",
  inputs: [
    {
      id: "freshDensityKgPerM3",
      kind: "number",
      label: "Fresh Density Kg Per M3",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "depthMeters",
      kind: "number",
      label: "Depth Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressureKilopascals",
      kind: "number",
      label: "Pressure Kilopascals",
      unit: "kPa",
    },
  ],
  calculate: (input) =>
    calculateConcreteFormworkPressure({
      freshDensityKgPerM3: input.freshDensityKgPerM3 as number,
      depthMeters: input.depthMeters as number,
    }),
});
export const concreteFormworkPressureTool = tool;
export const runConcreteFormworkPressure = tool.execute;
export default tool;
