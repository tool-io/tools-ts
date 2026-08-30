import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OverallHeatTransferCoefficientInput = Readonly<{
  readonly insideSquareMeterKelvinPerWatt: number;
  readonly wallSquareMeterKelvinPerWatt: number;
  readonly outsideSquareMeterKelvinPerWatt: number;
}>;
export type OverallHeatTransferCoefficientOutput = Readonly<{
  readonly overallWattsPerSquareMeterKelvin: number;
}>;

export const calculateOverallHeatTransferCoefficient = (
  x: OverallHeatTransferCoefficientInput,
): OverallHeatTransferCoefficientOutput => {
  if (
    !Number.isFinite(x.insideSquareMeterKelvinPerWatt) ||
    x.insideSquareMeterKelvinPerWatt < 0
  )
    simpleError(
      "insideSquareMeterKelvinPerWatt",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.wallSquareMeterKelvinPerWatt) ||
    x.wallSquareMeterKelvinPerWatt < 0
  )
    simpleError(
      "wallSquareMeterKelvinPerWatt",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.outsideSquareMeterKelvinPerWatt) ||
    x.outsideSquareMeterKelvinPerWatt < 0
  )
    simpleError(
      "outsideSquareMeterKelvinPerWatt",
      "Provide a finite number at least 0.",
    );
  const overallWattsPerSquareMeterKelvin =
    1 /
    (x.insideSquareMeterKelvinPerWatt +
      x.wallSquareMeterKelvinPerWatt +
      x.outsideSquareMeterKelvinPerWatt);
  if (!Number.isFinite(overallWattsPerSquareMeterKelvin))
    simpleError(
      "overallWattsPerSquareMeterKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    overallWattsPerSquareMeterKelvin: Object.is(
      overallWattsPerSquareMeterKelvin,
      -0,
    )
      ? 0
      : overallWattsPerSquareMeterKelvin,
  };
};

export const example = {
  input: {
    insideSquareMeterKelvinPerWatt: 0.1,
    wallSquareMeterKelvinPerWatt: 0.2,
    outsideSquareMeterKelvinPerWatt: 0.1,
  },
  output: { overallWattsPerSquareMeterKelvin: 2.5 },
} satisfies ToolExample<
  OverallHeatTransferCoefficientInput,
  OverallHeatTransferCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "engineering/overall-heat-transfer-coefficient",
  title: "Overall Heat Transfer Coefficient",
  description:
    "Area-based overall heat-transfer coefficient from three supplied thermal resistances per unit area in series.",
  inputs: [
    {
      id: "insideSquareMeterKelvinPerWatt",
      kind: "number",
      label: "Inside Square Meter Kelvin Per Watt",
      unit: "m²K/W",
      minimum: 0,
    },
    {
      id: "wallSquareMeterKelvinPerWatt",
      kind: "number",
      label: "Wall Square Meter Kelvin Per Watt",
      unit: "m²K/W",
      minimum: 0,
    },
    {
      id: "outsideSquareMeterKelvinPerWatt",
      kind: "number",
      label: "Outside Square Meter Kelvin Per Watt",
      unit: "m²K/W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overallWattsPerSquareMeterKelvin",
      kind: "number",
      label: "Overall Watts Per Square Meter Kelvin",
      unit: "W/(m²·K)",
    },
  ],
  calculate: (input) =>
    calculateOverallHeatTransferCoefficient({
      insideSquareMeterKelvinPerWatt:
        input.insideSquareMeterKelvinPerWatt as number,
      wallSquareMeterKelvinPerWatt:
        input.wallSquareMeterKelvinPerWatt as number,
      outsideSquareMeterKelvinPerWatt:
        input.outsideSquareMeterKelvinPerWatt as number,
    }),
});
export const overallHeatTransferCoefficientTool = tool;
export const runOverallHeatTransferCoefficient = tool.execute;
export default tool;
