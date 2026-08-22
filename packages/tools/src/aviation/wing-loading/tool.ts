import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WingLoadingInput = {
  readonly weightLb: number;
  readonly wingAreaFt2: number;
};

export type WingLoadingOutput = {
  readonly wingLoadingPsf: number;
};

export const wingLoadingExample = {
  input: { weightLb: 2000, wingAreaFt2: 150 },
  output: { wingLoadingPsf: 40 / 3 },
} satisfies ToolExample<WingLoadingInput, WingLoadingOutput>;

export const calculateWingLoading = (
  input: WingLoadingInput,
): WingLoadingOutput => {
  if (input.wingAreaFt2 <= 0)
    simpleError(
      "wingAreaFt2",
      "The wing area must be positive.",
      "invalid_area",
    );
  return { wingLoadingPsf: input.weightLb / input.wingAreaFt2 };
};

export const wingLoadingTool = createSimpleTool({
  calculate: (input) =>
    calculateWingLoading(input as unknown as WingLoadingInput),
  description:
    "Compute the wing loading as aircraft weight divided by wing area.",
  id: "aviation/wing-loading",
  inputs: [
    {
      description: "Aircraft weight.",
      id: "weightLb",
      kind: "number",
      label: "Weight",
      unit: "lb",
    },
    {
      description: "Total wing area.",
      id: "wingAreaFt2",
      kind: "number",
      label: "Wing area",
      unit: "ft²",
    },
  ],
  outputs: [
    {
      description: "Weight per unit of wing area.",
      format: "wing-loading",
      id: "wingLoadingPsf",
      kind: "number",
      label: "Wing loading",
      unit: "lb/ft²",
    },
  ],
  title: "Wing Loading Calculator",
});
export const runWingLoading = wingLoadingTool.execute;
export default wingLoadingTool;
