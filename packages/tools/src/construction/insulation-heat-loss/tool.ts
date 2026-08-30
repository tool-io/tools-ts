import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationHeatLossInput = Readonly<{
  readonly uValue: number;
  readonly areaM2: number;
  readonly temperatureDifferenceK: number;
}>;
export type InsulationHeatLossOutput = Readonly<{
  readonly heatLossW: number;
}>;

export const calculateInsulationHeatLoss = (
  x: InsulationHeatLossInput,
): InsulationHeatLossOutput => {
  if (!Number.isFinite(x.uValue) || x.uValue < 0)
    simpleError("uValue", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaM2) || x.areaM2 < 0)
    simpleError("areaM2", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.temperatureDifferenceK) ||
    x.temperatureDifferenceK < 0
  )
    simpleError(
      "temperatureDifferenceK",
      "Provide a finite number at least 0.",
    );
  const heatLossW = x.uValue * x.areaM2 * x.temperatureDifferenceK;
  if (!Number.isFinite(heatLossW))
    simpleError("heatLossW", "The inputs produce an invalid result.");
  return { heatLossW: Object.is(heatLossW, -0) ? 0 : heatLossW };
};

export const example = {
  input: { uValue: 0.5, areaM2: 10, temperatureDifferenceK: 20 },
  output: { heatLossW: 100 },
} satisfies ToolExample<InsulationHeatLossInput, InsulationHeatLossOutput>;

export const tool = createSimpleTool({
  id: "construction/insulation-heat-loss",
  title: "Insulation Heat Loss",
  description:
    "Calculate steady-state conductive heat-transfer rate through an assembly from U-value, area, and temperature difference.",
  inputs: [
    {
      id: "uValue",
      kind: "number",
      label: "Assembly U-value",
      unit: "W/(m²·K)",
      minimum: 0,
    },
    {
      id: "areaM2",
      kind: "number",
      label: "Assembly area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "temperatureDifferenceK",
      kind: "number",
      label: "Temperature difference",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "heatLossW", kind: "number", label: "Heat-transfer rate", unit: "W" },
  ],
  calculate: (input) =>
    calculateInsulationHeatLoss({
      uValue: input.uValue as number,
      areaM2: input.areaM2 as number,
      temperatureDifferenceK: input.temperatureDifferenceK as number,
    }),
});
export const insulationHeatLossTool = tool;
export const runInsulationHeatLoss = tool.execute;
export default tool;
