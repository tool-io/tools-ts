import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindowComparatorThresholdsInput = Readonly<{
  readonly centerVolts: number;
  readonly halfWidthVolts: number;
}>;
export type WindowComparatorThresholdsOutput = Readonly<{
  readonly lowerVolts: number;
  readonly upperVolts: number;
}>;

export const calculateWindowComparatorThresholds = (
  x: WindowComparatorThresholdsInput,
): WindowComparatorThresholdsOutput => {
  if (!Number.isFinite(x.centerVolts))
    simpleError("centerVolts", "Provide a finite number.");
  if (!Number.isFinite(x.halfWidthVolts) || x.halfWidthVolts < 0)
    simpleError("halfWidthVolts", "Provide a finite number at least 0.");
  const lowerVolts = x.centerVolts - x.halfWidthVolts;
  if (!Number.isFinite(lowerVolts))
    simpleError(
      "lowerVolts",
      "Inputs produce an undefined or non-finite result.",
    );
  const upperVolts = x.centerVolts + x.halfWidthVolts;
  if (!Number.isFinite(upperVolts))
    simpleError(
      "upperVolts",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    lowerVolts: Object.is(lowerVolts, -0) ? 0 : lowerVolts,
    upperVolts: Object.is(upperVolts, -0) ? 0 : upperVolts,
  };
};

export const example = {
  input: { centerVolts: 2, halfWidthVolts: 0.5 },
  output: { lowerVolts: 1.5, upperVolts: 2.5 },
} satisfies ToolExample<
  WindowComparatorThresholdsInput,
  WindowComparatorThresholdsOutput
>;

export const tool = createSimpleTool({
  id: "electronics/window-comparator-thresholds",
  title: "Window Comparator Thresholds",
  description:
    "Upper and lower window-comparator thresholds from a center voltage and nonnegative half-width.",
  inputs: [
    { id: "centerVolts", kind: "number", label: "Center Volts", unit: "V" },
    {
      id: "halfWidthVolts",
      kind: "number",
      label: "Half Width Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lowerVolts", kind: "number", label: "Lower Volts", unit: "V" },
    { id: "upperVolts", kind: "number", label: "Upper Volts", unit: "V" },
  ],
  calculate: (input) =>
    calculateWindowComparatorThresholds({
      centerVolts: input.centerVolts as number,
      halfWidthVolts: input.halfWidthVolts as number,
    }),
});
export const windowComparatorThresholdsTool = tool;
export const runWindowComparatorThresholds = tool.execute;
export default tool;
