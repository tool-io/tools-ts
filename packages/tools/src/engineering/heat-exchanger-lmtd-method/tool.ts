import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatExchangerLmtdMethodInput = Readonly<{
  readonly overallWattsPerSquareMeterKelvin: number;
  readonly areaSquareMeters: number;
  readonly correctedLmtdKelvin: number;
}>;
export type HeatExchangerLmtdMethodOutput = Readonly<{
  readonly dutyWatts: number;
}>;

export const calculateHeatExchangerLmtdMethod = (
  x: HeatExchangerLmtdMethodInput,
): HeatExchangerLmtdMethodOutput => {
  if (
    !Number.isFinite(x.overallWattsPerSquareMeterKelvin) ||
    x.overallWattsPerSquareMeterKelvin < 0
  )
    simpleError(
      "overallWattsPerSquareMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.correctedLmtdKelvin) || x.correctedLmtdKelvin < 0)
    simpleError("correctedLmtdKelvin", "Provide a finite number at least 0.");
  const dutyWatts =
    x.overallWattsPerSquareMeterKelvin *
    x.areaSquareMeters *
    x.correctedLmtdKelvin;
  if (!Number.isFinite(dutyWatts))
    simpleError(
      "dutyWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dutyWatts: Object.is(dutyWatts, -0) ? 0 : dutyWatts };
};

export const example = {
  input: {
    overallWattsPerSquareMeterKelvin: 100,
    areaSquareMeters: 10,
    correctedLmtdKelvin: 20,
  },
  output: { dutyWatts: 20000 },
} satisfies ToolExample<
  HeatExchangerLmtdMethodInput,
  HeatExchangerLmtdMethodOutput
>;

export const tool = createSimpleTool({
  id: "engineering/heat-exchanger-lmtd-method",
  title: "Heat Exchanger LMTD Method",
  description:
    "Steady heat-exchanger duty Q=U A ΔTlm for a supplied overall coefficient, reference area and already-corrected LMTD.",
  inputs: [
    {
      id: "overallWattsPerSquareMeterKelvin",
      kind: "number",
      label: "Overall Watts Per Square Meter Kelvin",
      unit: "W/(m²·K)",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "correctedLmtdKelvin",
      kind: "number",
      label: "Corrected Lmtd Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dutyWatts", kind: "number", label: "Duty Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateHeatExchangerLmtdMethod({
      overallWattsPerSquareMeterKelvin:
        input.overallWattsPerSquareMeterKelvin as number,
      areaSquareMeters: input.areaSquareMeters as number,
      correctedLmtdKelvin: input.correctedLmtdKelvin as number,
    }),
});
export const heatExchangerLmtdMethodTool = tool;
export const runHeatExchangerLmtdMethod = tool.execute;
export default tool;
