import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FinEfficiencyRectangularInput = Readonly<{
  readonly convectionWattsPerSquareMeterKelvin: number;
  readonly conductivityWattsPerMeterKelvin: number;
  readonly thicknessMeters: number;
  readonly finLengthMeters: number;
}>;
export type FinEfficiencyRectangularOutput = Readonly<{
  readonly finEfficiency: number;
}>;

export const calculateFinEfficiencyRectangular = (
  x: FinEfficiencyRectangularInput,
): FinEfficiencyRectangularOutput => {
  if (
    !Number.isFinite(x.convectionWattsPerSquareMeterKelvin) ||
    x.convectionWattsPerSquareMeterKelvin < 0
  )
    simpleError(
      "convectionWattsPerSquareMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.conductivityWattsPerMeterKelvin) ||
    x.conductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "conductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.thicknessMeters) || x.thicknessMeters < 0)
    simpleError("thicknessMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.finLengthMeters) || x.finLengthMeters < 0)
    simpleError("finLengthMeters", "Provide a finite number at least 0.");
  const finEfficiency = ((z) => (z === 0 ? 1 : Math.tanh(z) / z))(
    Math.sqrt(
      (2 * x.convectionWattsPerSquareMeterKelvin) /
        (x.conductivityWattsPerMeterKelvin * x.thicknessMeters),
    ) * x.finLengthMeters,
  );
  if (!Number.isFinite(finEfficiency))
    simpleError(
      "finEfficiency",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { finEfficiency: Object.is(finEfficiency, -0) ? 0 : finEfficiency };
};

export const example = {
  input: {
    convectionWattsPerSquareMeterKelvin: 10,
    conductivityWattsPerMeterKelvin: 200,
    thicknessMeters: 0.01,
    finLengthMeters: 0.1,
  },
  output: { finEfficiency: 0.9679481335147452 },
} satisfies ToolExample<
  FinEfficiencyRectangularInput,
  FinEfficiencyRectangularOutput
>;

export const tool = createSimpleTool({
  id: "engineering/fin-efficiency-rectangular",
  title: "Fin Efficiency Rectangular",
  description:
    "Straight rectangular fin efficiency tanh(mL)/(mL) for a wide constant-thickness fin with an insulated tip; m=√(2h/kt).",
  inputs: [
    {
      id: "convectionWattsPerSquareMeterKelvin",
      kind: "number",
      label: "Convection Watts Per Square Meter Kelvin",
      unit: "W/(m²·K)",
      minimum: 0,
    },
    {
      id: "conductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
    {
      id: "thicknessMeters",
      kind: "number",
      label: "Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "finLengthMeters",
      kind: "number",
      label: "Fin Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "finEfficiency", kind: "number", label: "Fin Efficiency" }],
  calculate: (input) =>
    calculateFinEfficiencyRectangular({
      convectionWattsPerSquareMeterKelvin:
        input.convectionWattsPerSquareMeterKelvin as number,
      conductivityWattsPerMeterKelvin:
        input.conductivityWattsPerMeterKelvin as number,
      thicknessMeters: input.thicknessMeters as number,
      finLengthMeters: input.finLengthMeters as number,
    }),
});
export const finEfficiencyRectangularTool = tool;
export const runFinEfficiencyRectangular = tool.execute;
export default tool;
