import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationRValueAdditiveInput = Readonly<{
  readonly layerRValues: readonly number[];
}>;
export type InsulationRValueAdditiveOutput = Readonly<{
  readonly totalRValue: number;
}>;

export const calculateInsulationRValueAdditive = (
  x: InsulationRValueAdditiveInput,
): InsulationRValueAdditiveOutput => {
  if (
    !Array.isArray(x.layerRValues) ||
    !x.layerRValues.every((v) => typeof v === "number" && Number.isFinite(v))
  )
    simpleError("layerRValues", "Provide a finite number list.");
  if (!x.layerRValues.every((v) => v >= 0))
    simpleError("layerRValues", "R-values cannot be negative.");
  const totalRValue = x.layerRValues.reduce((a, b) => a + b, 0);
  if (!Number.isFinite(totalRValue))
    simpleError("totalRValue", "The inputs produce an invalid result.");
  return { totalRValue: Object.is(totalRValue, -0) ? 0 : totalRValue };
};

export const example = {
  input: { layerRValues: [1, 2] },
  output: { totalRValue: 3 },
} satisfies ToolExample<
  InsulationRValueAdditiveInput,
  InsulationRValueAdditiveOutput
>;

export const tool = createSimpleTool({
  id: "construction/insulation-r-value-additive",
  title: "Insulation R-Value Additive",
  description:
    "Sum thermal resistance values of layers in series; use the same R-value unit for every layer.",
  inputs: [
    {
      id: "layerRValues",
      kind: "numberList",
      label: "Layer R-values",
      unit: "m²·K/W",
    },
  ],
  outputs: [
    {
      id: "totalRValue",
      kind: "number",
      label: "Total thermal resistance",
      unit: "m²·K/W",
    },
  ],
  calculate: (input) =>
    calculateInsulationRValueAdditive({
      layerRValues: input.layerRValues as readonly number[],
    }),
});
export const insulationRValueAdditiveTool = tool;
export const runInsulationRValueAdditive = tool.execute;
export default tool;
