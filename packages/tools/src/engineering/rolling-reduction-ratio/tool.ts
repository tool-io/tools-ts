import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RollingReductionRatioInput = Readonly<{
  readonly initialThicknessMillimeters: number;
  readonly finalThicknessMillimeters: number;
}>;
export type RollingReductionRatioOutput = Readonly<{
  readonly reductionPercent: number;
}>;

export const calculateRollingReductionRatio = (
  x: RollingReductionRatioInput,
): RollingReductionRatioOutput => {
  if (
    !Number.isFinite(x.initialThicknessMillimeters) ||
    x.initialThicknessMillimeters < 0
  )
    simpleError(
      "initialThicknessMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.finalThicknessMillimeters) ||
    x.finalThicknessMillimeters < 0
  )
    simpleError(
      "finalThicknessMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.finalThicknessMillimeters > x.initialThicknessMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const reductionPercent =
    (100 * (x.initialThicknessMillimeters - x.finalThicknessMillimeters)) /
    x.initialThicknessMillimeters;
  if (!Number.isFinite(reductionPercent))
    simpleError(
      "reductionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    reductionPercent: Object.is(reductionPercent, -0) ? 0 : reductionPercent,
  };
};

export const example = {
  input: { initialThicknessMillimeters: 10, finalThicknessMillimeters: 8 },
  output: { reductionPercent: 20 },
} satisfies ToolExample<
  RollingReductionRatioInput,
  RollingReductionRatioOutput
>;

export const tool = createSimpleTool({
  id: "engineering/rolling-reduction-ratio",
  title: "Rolling Reduction Ratio",
  description:
    "Thickness reduction percentage for a flat rolling pass: 100(t0−tf)/t0.",
  inputs: [
    {
      id: "initialThicknessMillimeters",
      kind: "number",
      label: "Initial Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "finalThicknessMillimeters",
      kind: "number",
      label: "Final Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "reductionPercent",
      kind: "number",
      label: "Reduction Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateRollingReductionRatio({
      initialThicknessMillimeters: input.initialThicknessMillimeters as number,
      finalThicknessMillimeters: input.finalThicknessMillimeters as number,
    }),
});
export const rollingReductionRatioTool = tool;
export const runRollingReductionRatio = tool.execute;
export default tool;
