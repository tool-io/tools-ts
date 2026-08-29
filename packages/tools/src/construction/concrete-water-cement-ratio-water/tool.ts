import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteWaterCementRatioWaterInput = Readonly<{
  readonly cementMassKg: number;
  readonly waterCementRatio: number;
}>;
export type ConcreteWaterCementRatioWaterOutput = Readonly<{
  waterMassKg: number;
}>;

export const calculateConcreteWaterCementRatioWater = (
  i: ConcreteWaterCementRatioWaterInput,
): ConcreteWaterCementRatioWaterOutput => {
  const value = i.cementMassKg * i.waterCementRatio;
  if (!Number.isFinite(value))
    simpleError("waterMassKg", "The inputs produce a non-finite result.");
  return { waterMassKg: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { cementMassKg: 300, waterCementRatio: 0.45 },
  output: { waterMassKg: 135 },
} satisfies ToolExample<
  ConcreteWaterCementRatioWaterInput,
  ConcreteWaterCementRatioWaterOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-water-cement-ratio-water",
  title: "Water Cement Ratio Water",
  description:
    "Calculate mixing-water mass from cement mass and a water-to-cement mass ratio; account for aggregate moisture separately.",
  inputs: [
    {
      id: "cementMassKg",
      kind: "number",
      label: "Cement Mass (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "waterCementRatio",
      kind: "number",
      label: "Water Cement Ratio",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "waterMassKg", kind: "number", label: "Water Mass (kg)", unit: "kg" },
  ],
  calculate: (input) =>
    calculateConcreteWaterCementRatioWater({
      cementMassKg: input.cementMassKg as number,
      waterCementRatio: input.waterCementRatio as number,
    }),
});
export const concreteWaterCementRatioWaterTool = tool;
export const runConcreteWaterCementRatioWater = tool.execute;
export default tool;
