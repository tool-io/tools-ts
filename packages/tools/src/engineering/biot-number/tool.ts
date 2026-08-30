import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiotNumberInput = Readonly<{
  readonly coefficientWattsPerSquareMeterKelvin: number;
  readonly characteristicMeters: number;
  readonly conductivityWattsPerMeterKelvin: number;
}>;
export type BiotNumberOutput = Readonly<{
  readonly biotNumber: number;
}>;

export const calculateBiotNumber = (x: BiotNumberInput): BiotNumberOutput => {
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
    !Number.isFinite(x.conductivityWattsPerMeterKelvin) ||
    x.conductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "conductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  const biotNumber =
    (x.coefficientWattsPerSquareMeterKelvin * x.characteristicMeters) /
    x.conductivityWattsPerMeterKelvin;
  if (!Number.isFinite(biotNumber))
    simpleError(
      "biotNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { biotNumber: Object.is(biotNumber, -0) ? 0 : biotNumber };
};

export const example = {
  input: {
    coefficientWattsPerSquareMeterKelvin: 10,
    characteristicMeters: 0.1,
    conductivityWattsPerMeterKelvin: 1,
  },
  output: { biotNumber: 1 },
} satisfies ToolExample<BiotNumberInput, BiotNumberOutput>;

export const tool = createSimpleTool({
  id: "engineering/biot-number",
  title: "Biot Number",
  description:
    "Biot number hLc/k for a body with characteristic length Lc=volume/surface area supplied by the user.",
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
      id: "conductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "biotNumber", kind: "number", label: "Biot Number" }],
  calculate: (input) =>
    calculateBiotNumber({
      coefficientWattsPerSquareMeterKelvin:
        input.coefficientWattsPerSquareMeterKelvin as number,
      characteristicMeters: input.characteristicMeters as number,
      conductivityWattsPerMeterKelvin:
        input.conductivityWattsPerMeterKelvin as number,
    }),
});
export const biotNumberTool = tool;
export const runBiotNumber = tool.execute;
export default tool;
