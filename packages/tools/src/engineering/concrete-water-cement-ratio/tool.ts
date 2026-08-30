import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteWaterCementRatioInput = Readonly<{
  readonly waterKilograms: number;
  readonly cementKilograms: number;
}>;
export type ConcreteWaterCementRatioOutput = Readonly<{
  readonly waterCementRatio: number;
}>;

export const calculateConcreteWaterCementRatio = (
  x: ConcreteWaterCementRatioInput,
): ConcreteWaterCementRatioOutput => {
  if (!Number.isFinite(x.waterKilograms) || x.waterKilograms < 0)
    simpleError("waterKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cementKilograms) || x.cementKilograms < 0)
    simpleError("cementKilograms", "Provide a finite number at least 0.");
  const waterCementRatio = x.waterKilograms / x.cementKilograms;
  if (!Number.isFinite(waterCementRatio))
    simpleError(
      "waterCementRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    waterCementRatio: Object.is(waterCementRatio, -0) ? 0 : waterCementRatio,
  };
};

export const example = {
  input: { waterKilograms: 180, cementKilograms: 360 },
  output: { waterCementRatio: 0.5 },
} satisfies ToolExample<
  ConcreteWaterCementRatioInput,
  ConcreteWaterCementRatioOutput
>;

export const tool = createSimpleTool({
  id: "engineering/concrete-water-cement-ratio",
  title: "Concrete Water Cement Ratio",
  description:
    "Concrete mix water-to-cement mass ratio; no inference of strength, durability or code compliance.",
  inputs: [
    {
      id: "waterKilograms",
      kind: "number",
      label: "Water Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "cementKilograms",
      kind: "number",
      label: "Cement Kilograms",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "waterCementRatio", kind: "number", label: "Water Cement Ratio" },
  ],
  calculate: (input) =>
    calculateConcreteWaterCementRatio({
      waterKilograms: input.waterKilograms as number,
      cementKilograms: input.cementKilograms as number,
    }),
});
export const concreteWaterCementRatioTool = tool;
export const runConcreteWaterCementRatio = tool.execute;
export default tool;
