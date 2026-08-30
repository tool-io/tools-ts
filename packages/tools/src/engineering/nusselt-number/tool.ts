import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NusseltNumberInput = Readonly<{
  readonly coefficientWattsPerSquareMeterKelvin: number;
  readonly characteristicMeters: number;
  readonly fluidConductivityWattsPerMeterKelvin: number;
}>;
export type NusseltNumberOutput = Readonly<{
  readonly nusseltNumber: number;
}>;

export const calculateNusseltNumber = (
  x: NusseltNumberInput,
): NusseltNumberOutput => {
  if (
    !Number.isFinite(x.coefficientWattsPerSquareMeterKelvin) ||
    x.coefficientWattsPerSquareMeterKelvin < 0
  )
    simpleError(
      "coefficientWattsPerSquareMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.characteristicMeters) || x.characteristicMeters < 0)
    simpleError("characteristicMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.fluidConductivityWattsPerMeterKelvin) ||
    x.fluidConductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "fluidConductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  const nusseltNumber =
    (x.coefficientWattsPerSquareMeterKelvin * x.characteristicMeters) /
    x.fluidConductivityWattsPerMeterKelvin;
  if (!Number.isFinite(nusseltNumber))
    simpleError(
      "nusseltNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { nusseltNumber: Object.is(nusseltNumber, -0) ? 0 : nusseltNumber };
};

export const example = {
  input: {
    coefficientWattsPerSquareMeterKelvin: 10,
    characteristicMeters: 0.1,
    fluidConductivityWattsPerMeterKelvin: 0.1,
  },
  output: { nusseltNumber: 10 },
} satisfies ToolExample<NusseltNumberInput, NusseltNumberOutput>;

export const tool = createSimpleTool({
  id: "engineering/nusselt-number",
  title: "Nusselt Number",
  description:
    "Nusselt number hL/k from convection coefficient, characteristic length and fluid thermal conductivity.",
  inputs: [
    {
      id: "coefficientWattsPerSquareMeterKelvin",
      kind: "number",
      label: "Coefficient Watts Per Square Meter Kelvin",
      unit: "W/(m²·K)",
      minimum: 0,
    },
    {
      id: "characteristicMeters",
      kind: "number",
      label: "Characteristic Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "fluidConductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Fluid Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "nusseltNumber", kind: "number", label: "Nusselt Number" }],
  calculate: (input) =>
    calculateNusseltNumber({
      coefficientWattsPerSquareMeterKelvin:
        input.coefficientWattsPerSquareMeterKelvin as number,
      characteristicMeters: input.characteristicMeters as number,
      fluidConductivityWattsPerMeterKelvin:
        input.fluidConductivityWattsPerMeterKelvin as number,
    }),
});
export const nusseltNumberTool = tool;
export const runNusseltNumber = tool.execute;
export default tool;
