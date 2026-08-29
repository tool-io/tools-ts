import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteOrderWasteInput = Readonly<{
  readonly netVolumeCubicMeters: number;
  readonly wastePercent: number;
}>;
export type ConcreteOrderWasteOutput = Readonly<{
  orderVolumeCubicMeters: number;
}>;

export const calculateConcreteOrderWaste = (
  i: ConcreteOrderWasteInput,
): ConcreteOrderWasteOutput => {
  const value = i.netVolumeCubicMeters * (1 + i.wastePercent / 100);
  if (!Number.isFinite(value))
    simpleError(
      "orderVolumeCubicMeters",
      "The inputs produce a non-finite result.",
    );
  return { orderVolumeCubicMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { netVolumeCubicMeters: 10, wastePercent: 5 },
  output: { orderVolumeCubicMeters: 10.5 },
} satisfies ToolExample<ConcreteOrderWasteInput, ConcreteOrderWasteOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-order-waste",
  title: "Concrete Order With Waste",
  description:
    "Calculate concrete order volume by adding a specified waste percentage to net placed volume; this is a purchasing allowance, not shrinkage prediction.",
  inputs: [
    {
      id: "netVolumeCubicMeters",
      kind: "number",
      label: "Net Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste (%)",
      unit: "%",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "orderVolumeCubicMeters",
      kind: "number",
      label: "Order Volume (m³)",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateConcreteOrderWaste({
      netVolumeCubicMeters: input.netVolumeCubicMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const concreteOrderWasteTool = tool;
export const runConcreteOrderWaste = tool.execute;
export default tool;
