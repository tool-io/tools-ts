import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DotDensityDotsPerUnitInput = Readonly<{
  readonly value: number;
  readonly unitsPerDot: number;
}>;
export type DotDensityDotsPerUnitOutput = Readonly<{
  readonly dotCount: number;
}>;

export const calculateDotDensityDotsPerUnit = (
  x: DotDensityDotsPerUnitInput,
): DotDensityDotsPerUnitOutput => {
  if (!Number.isFinite(x.value) || x.value < 0)
    simpleError("value", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.unitsPerDot) || x.unitsPerDot <= 0)
    simpleError("unitsPerDot", "Provide a finite positive number.");
  const dotCount = x.value / x.unitsPerDot;
  if (!Number.isFinite(dotCount))
    simpleError(
      "dotCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dotCount: Object.is(dotCount, -0) ? 0 : dotCount };
};

export const example = {
  input: {
    value: 1000,
    unitsPerDot: 10,
  },
  output: { dotCount: 100 },
} satisfies ToolExample<
  DotDensityDotsPerUnitInput,
  DotDensityDotsPerUnitOutput
>;

export const tool = createSimpleTool({
  id: "cartography/dot-density-dots-per-unit",
  title: "Dot Density Dots Per Unit",
  description:
    "Count of map dots needed for a value when one dot represents a fixed number of units.",
  inputs: [
    { id: "value", kind: "number", label: "Value", minimum: 0 },
    { id: "unitsPerDot", kind: "number", label: "Units Per Dot", minimum: 0 },
  ],
  outputs: [{ id: "dotCount", kind: "number", label: "Dot Count" }],
  calculate: (input) =>
    calculateDotDensityDotsPerUnit({
      value: input.value as number,
      unitsPerDot: input.unitsPerDot as number,
    }),
});
export const dotDensityDotsPerUnitTool = tool;
export const runDotDensityDotsPerUnit = tool.execute;
export default tool;
