import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DemonstratedCrosswindComparisonInput = {
  readonly crosswindKt: number;
  readonly maxDemonstratedCrosswindKt: number;
};

export type DemonstratedCrosswindComparisonOutput = {
  readonly atOrBelowDemonstratedValue: boolean;
};

export const demonstratedCrosswindComparisonExample = {
  input: { crosswindKt: 15, maxDemonstratedCrosswindKt: 20 },
  output: { atOrBelowDemonstratedValue: true },
} satisfies ToolExample<
  DemonstratedCrosswindComparisonInput,
  DemonstratedCrosswindComparisonOutput
>;

export const calculateDemonstratedCrosswindComparison = (
  input: DemonstratedCrosswindComparisonInput,
): DemonstratedCrosswindComparisonOutput => ({
  atOrBelowDemonstratedValue:
    input.crosswindKt <= input.maxDemonstratedCrosswindKt,
});

export const demonstratedCrosswindComparisonTool = createSimpleTool({
  calculate: (input) =>
    calculateDemonstratedCrosswindComparison(
      input as unknown as DemonstratedCrosswindComparisonInput,
    ),
  description:
    "Compare a crosswind component with a published demonstrated value; this does not determine an operating limitation.",
  id: "aviation/demonstrated-crosswind-comparison",
  inputs: [
    {
      description: "Crosswind component for the departure runway.",
      id: "crosswindKt",
      kind: "number",
      label: "Crosswind",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Maximum demonstrated crosswind of the aircraft.",
      id: "maxDemonstratedCrosswindKt",
      kind: "number",
      label: "Max demonstrated crosswind",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "True when the component does not exceed the demonstrated value.",
      id: "atOrBelowDemonstratedValue",
      kind: "boolean",
      label: "At or below demonstrated value",
    },
  ],
  title: "Demonstrated Crosswind Comparison",
});
export const runDemonstratedCrosswindComparison =
  demonstratedCrosswindComparisonTool.execute;
export default demonstratedCrosswindComparisonTool;
