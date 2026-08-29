import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteBagsNeededInput = Readonly<{
  readonly requiredVolumeCubicMeters: number;
  readonly yieldPerBagCubicMeters: number;
}>;
export type ConcreteBagsNeededOutput = Readonly<{ bagCount: number }>;

export const calculateConcreteBagsNeeded = (
  i: ConcreteBagsNeededInput,
): ConcreteBagsNeededOutput => {
  const value = Math.ceil(
    i.requiredVolumeCubicMeters / i.yieldPerBagCubicMeters,
  );
  if (!Number.isFinite(value))
    simpleError("bagCount", "The inputs produce a non-finite result.");
  return { bagCount: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { requiredVolumeCubicMeters: 0.35, yieldPerBagCubicMeters: 0.017 },
  output: { bagCount: 21 },
} satisfies ToolExample<ConcreteBagsNeededInput, ConcreteBagsNeededOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-bags-needed",
  title: "Concrete Bags Needed",
  description:
    "Round up the number of prebagged concrete mix bags from required pour volume and the manufacturer's mixed yield per bag.",
  inputs: [
    {
      id: "requiredVolumeCubicMeters",
      kind: "number",
      label: "Required Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "yieldPerBagCubicMeters",
      kind: "number",
      label: "Yield Per Bag (m³)",
      unit: "m³",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "bagCount", kind: "integer", label: "Bag Count" }],
  calculate: (input) =>
    calculateConcreteBagsNeeded({
      requiredVolumeCubicMeters: input.requiredVolumeCubicMeters as number,
      yieldPerBagCubicMeters: input.yieldPerBagCubicMeters as number,
    }),
});
export const concreteBagsNeededTool = tool;
export const runConcreteBagsNeeded = tool.execute;
export default tool;
