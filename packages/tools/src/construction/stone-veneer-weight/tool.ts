import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StoneVeneerWeightInput = Readonly<{
  readonly veneerAreaM2: number;
  readonly arealMassKgPerM2: number;
}>;
export type StoneVeneerWeightOutput = Readonly<{
  readonly veneerMassKg: number;
}>;

export const calculateStoneVeneerWeight = (
  x: StoneVeneerWeightInput,
): StoneVeneerWeightOutput => {
  if (!Number.isFinite(x.veneerAreaM2) || x.veneerAreaM2 < 0)
    simpleError("veneerAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.arealMassKgPerM2) || x.arealMassKgPerM2 < 0)
    simpleError("arealMassKgPerM2", "Provide a finite number at least 0.");
  const veneerMassKg = x.veneerAreaM2 * x.arealMassKgPerM2;
  if (!Number.isFinite(veneerMassKg))
    simpleError("veneerMassKg", "The inputs produce an invalid result.");
  return { veneerMassKg: Object.is(veneerMassKg, -0) ? 0 : veneerMassKg };
};

export const example = {
  input: { veneerAreaM2: 10, arealMassKgPerM2: 40 },
  output: { veneerMassKg: 400 },
} satisfies ToolExample<StoneVeneerWeightInput, StoneVeneerWeightOutput>;

export const tool = createSimpleTool({
  id: "construction/stone-veneer-weight",
  title: "Stone Veneer Weight",
  description:
    "Estimate stone-veneer mass from installed area and manufacturer's mass per square meter; exclude backing and anchors.",
  inputs: [
    {
      id: "veneerAreaM2",
      kind: "number",
      label: "Installed veneer area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "arealMassKgPerM2",
      kind: "number",
      label: "Veneer mass per area",
      unit: "kg/m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "veneerMassKg",
      kind: "number",
      label: "Stone veneer mass",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateStoneVeneerWeight({
      veneerAreaM2: input.veneerAreaM2 as number,
      arealMassKgPerM2: input.arealMassKgPerM2 as number,
    }),
});
export const stoneVeneerWeightTool = tool;
export const runStoneVeneerWeight = tool.execute;
export default tool;
