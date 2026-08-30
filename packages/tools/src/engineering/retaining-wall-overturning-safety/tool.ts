import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RetainingWallOverturningSafetyInput = Readonly<{
  readonly stabilizingMomentNewtonMeters: number;
  readonly overturningMomentNewtonMeters: number;
}>;
export type RetainingWallOverturningSafetyOutput = Readonly<{
  readonly momentRatio: number;
}>;

export const calculateRetainingWallOverturningSafety = (
  x: RetainingWallOverturningSafetyInput,
): RetainingWallOverturningSafetyOutput => {
  if (
    !Number.isFinite(x.stabilizingMomentNewtonMeters) ||
    x.stabilizingMomentNewtonMeters < 0
  )
    simpleError(
      "stabilizingMomentNewtonMeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.overturningMomentNewtonMeters) ||
    x.overturningMomentNewtonMeters < 0
  )
    simpleError(
      "overturningMomentNewtonMeters",
      "Provide a finite number at least 0.",
    );
  const momentRatio =
    x.stabilizingMomentNewtonMeters / x.overturningMomentNewtonMeters;
  if (!Number.isFinite(momentRatio))
    simpleError(
      "momentRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { momentRatio: Object.is(momentRatio, -0) ? 0 : momentRatio };
};

export const example = {
  input: {
    stabilizingMomentNewtonMeters: 30000,
    overturningMomentNewtonMeters: 10000,
  },
  output: { momentRatio: 3 },
} satisfies ToolExample<
  RetainingWallOverturningSafetyInput,
  RetainingWallOverturningSafetyOutput
>;

export const tool = createSimpleTool({
  id: "engineering/retaining-wall-overturning-safety",
  title: "Retaining Wall Overturning Safety",
  description:
    "Overturning safety ratio of supplied stabilizing moment to supplied overturning moment; no prescribed acceptance threshold.",
  inputs: [
    {
      id: "stabilizingMomentNewtonMeters",
      kind: "number",
      label: "Stabilizing Moment Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
    {
      id: "overturningMomentNewtonMeters",
      kind: "number",
      label: "Overturning Moment Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "momentRatio", kind: "number", label: "Moment Ratio" }],
  calculate: (input) =>
    calculateRetainingWallOverturningSafety({
      stabilizingMomentNewtonMeters:
        input.stabilizingMomentNewtonMeters as number,
      overturningMomentNewtonMeters:
        input.overturningMomentNewtonMeters as number,
    }),
});
export const retainingWallOverturningSafetyTool = tool;
export const runRetainingWallOverturningSafety = tool.execute;
export default tool;
