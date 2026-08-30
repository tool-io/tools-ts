import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SedimentationOverflowRateInput = Readonly<{
  readonly flowCubicMetersPerDay: number;
  readonly planAreaSquareMeters: number;
}>;
export type SedimentationOverflowRateOutput = Readonly<{
  readonly overflowMetersPerDay: number;
}>;

export const calculateSedimentationOverflowRate = (
  x: SedimentationOverflowRateInput,
): SedimentationOverflowRateOutput => {
  if (!Number.isFinite(x.flowCubicMetersPerDay) || x.flowCubicMetersPerDay < 0)
    simpleError("flowCubicMetersPerDay", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.planAreaSquareMeters) || x.planAreaSquareMeters < 0)
    simpleError("planAreaSquareMeters", "Provide a finite number at least 0.");
  const overflowMetersPerDay = x.flowCubicMetersPerDay / x.planAreaSquareMeters;
  if (!Number.isFinite(overflowMetersPerDay))
    simpleError(
      "overflowMetersPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    overflowMetersPerDay: Object.is(overflowMetersPerDay, -0)
      ? 0
      : overflowMetersPerDay,
  };
};

export const example = {
  input: { flowCubicMetersPerDay: 1000, planAreaSquareMeters: 100 },
  output: { overflowMetersPerDay: 10 },
} satisfies ToolExample<
  SedimentationOverflowRateInput,
  SedimentationOverflowRateOutput
>;

export const tool = createSimpleTool({
  id: "engineering/sedimentation-overflow-rate",
  title: "Sedimentation Overflow Rate",
  description:
    "Surface overflow rate of a clarifier from volumetric flow divided by plan surface area; not a settling performance prediction.",
  inputs: [
    {
      id: "flowCubicMetersPerDay",
      kind: "number",
      label: "Flow Cubic Meters Per Day",
      unit: "m³/day",
      minimum: 0,
    },
    {
      id: "planAreaSquareMeters",
      kind: "number",
      label: "Plan Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overflowMetersPerDay",
      kind: "number",
      label: "Overflow Meters Per Day",
      unit: "m/day",
    },
  ],
  calculate: (input) =>
    calculateSedimentationOverflowRate({
      flowCubicMetersPerDay: input.flowCubicMetersPerDay as number,
      planAreaSquareMeters: input.planAreaSquareMeters as number,
    }),
});
export const sedimentationOverflowRateTool = tool;
export const runSedimentationOverflowRate = tool.execute;
export default tool;
