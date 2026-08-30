import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WristCoveragePercentInput = Readonly<{
  readonly lugToLugMillimeters: number;
  readonly wristWidthMillimeters: number;
}>;
export type WristCoveragePercentOutput = Readonly<{
  readonly coveragePercent: number;
}>;

export const calculateWristCoveragePercent = (
  x: WristCoveragePercentInput,
): WristCoveragePercentOutput => {
  if (!Number.isFinite(x.lugToLugMillimeters) || x.lugToLugMillimeters <= 0)
    simpleError("lugToLugMillimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.wristWidthMillimeters) || x.wristWidthMillimeters <= 0)
    simpleError("wristWidthMillimeters", "Provide a finite positive number.");
  const coveragePercent =
    (100 * x.lugToLugMillimeters) / x.wristWidthMillimeters;
  if (!Number.isFinite(coveragePercent))
    simpleError(
      "coveragePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    coveragePercent: Object.is(coveragePercent, -0) ? 0 : coveragePercent,
  };
};

export const example = {
  input: {
    lugToLugMillimeters: 50,
    wristWidthMillimeters: 60,
  },
  output: { coveragePercent: 83.33333333333333 },
} satisfies ToolExample<WristCoveragePercentInput, WristCoveragePercentOutput>;

export const tool = createSimpleTool({
  id: "horology/wrist-coverage-percent",
  title: "Wrist Coverage Percent",
  description: "Lug-to-lug watch span as a percentage of wearer wrist width.",
  inputs: [
    {
      id: "lugToLugMillimeters",
      kind: "number",
      label: "Lug To Lug Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "wristWidthMillimeters",
      kind: "number",
      label: "Wrist Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coveragePercent",
      kind: "number",
      label: "Coverage Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateWristCoveragePercent({
      lugToLugMillimeters: input.lugToLugMillimeters as number,
      wristWidthMillimeters: input.wristWidthMillimeters as number,
    }),
});
export const wristCoveragePercentTool = tool;
export const runWristCoveragePercent = tool.execute;
export default tool;
