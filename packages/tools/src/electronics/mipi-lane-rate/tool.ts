import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MipiLaneRateInput = Readonly<{
  readonly aggregatePayloadGbps: number;
  readonly laneCount: number;
  readonly payloadEfficiency: number;
}>;
export type MipiLaneRateOutput = Readonly<{
  readonly requiredLaneGbps: number;
}>;

export const calculateMipiLaneRate = (
  x: MipiLaneRateInput,
): MipiLaneRateOutput => {
  if (!Number.isFinite(x.aggregatePayloadGbps) || x.aggregatePayloadGbps < 0)
    simpleError("aggregatePayloadGbps", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.laneCount) || x.laneCount < 1)
    simpleError("laneCount", "Provide a safe integer at least 1.");
  if (!Number.isFinite(x.payloadEfficiency) || x.payloadEfficiency < 0)
    simpleError("payloadEfficiency", "Provide a finite number at least 0.");
  if (!(x.laneCount > 0 && x.payloadEfficiency > 0 && x.payloadEfficiency <= 1))
    simpleError(
      "input",
      "Lane count must be positive and efficiency in (0,1].",
    );
  const requiredLaneGbps =
    x.aggregatePayloadGbps / (x.laneCount * x.payloadEfficiency);
  if (!Number.isFinite(requiredLaneGbps))
    simpleError("requiredLaneGbps", "The inputs produce an invalid result.");
  return {
    requiredLaneGbps: Object.is(requiredLaneGbps, -0) ? 0 : requiredLaneGbps,
  };
};

export const example = {
  input: { aggregatePayloadGbps: 4, laneCount: 4, payloadEfficiency: 0.8 },
  output: { requiredLaneGbps: 1.25 },
} satisfies ToolExample<MipiLaneRateInput, MipiLaneRateOutput>;

export const tool = createSimpleTool({
  id: "electronics/mipi-lane-rate",
  title: "MIPI Lane Rate",
  description:
    "Calculate required per-lane serial rate from aggregate payload rate, active lane count, and specified usable payload efficiency.",
  inputs: [
    {
      id: "aggregatePayloadGbps",
      kind: "number",
      label: "Aggregate payload rate",
      unit: "Gb/s",
      minimum: 0,
    },
    { id: "laneCount", kind: "integer", label: "Active lanes", minimum: 1 },
    {
      id: "payloadEfficiency",
      kind: "number",
      label: "Payload efficiency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "requiredLaneGbps",
      kind: "number",
      label: "Required rate per lane",
      unit: "Gb/s",
    },
  ],
  calculate: (input) =>
    calculateMipiLaneRate({
      aggregatePayloadGbps: input.aggregatePayloadGbps as number,
      laneCount: input.laneCount as number,
      payloadEfficiency: input.payloadEfficiency as number,
    }),
});
export const mipiLaneRateTool = tool;
export const runMipiLaneRate = tool.execute;
export default tool;
