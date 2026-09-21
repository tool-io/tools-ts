import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pullNewtons: number;
  readonly theoreticalMetersPerSecond: number;
  readonly slip: number;
};
export type Output = {
  readonly idealWatts: number;
  readonly deliveredWatts: number;
  readonly slipLossWatts: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pullNewtons: { type: "number", minimum: 0 },
    theoreticalMetersPerSecond: { type: "number", minimum: 0 },
    slip: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["pullNewtons", "theoreticalMetersPerSecond", "slip"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealWatts: { type: "number" },
    deliveredWatts: { type: "number" },
    slipLossWatts: { type: "number" },
  },
  required: ["idealWatts", "deliveredWatts", "slipLossWatts"],
} as const;
/** Calculate tractor power drawbar slip term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pullNewtons, theoreticalMetersPerSecond, slip } = request;
  const compute = (): Output => {
    H.domain(pullNewtons >= 0 && theoreticalMetersPerSecond >= 0);
    H.probability(slip);
    return {
      idealWatts: pullNewtons * theoreticalMetersPerSecond,
      deliveredWatts: pullNewtons * theoreticalMetersPerSecond * (1 - slip),
      slipLossWatts: pullNewtons * theoreticalMetersPerSecond * slip,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pullNewtons: 1000, theoreticalMetersPerSecond: 2, slip: 0.2 },
  output: { idealWatts: 2000, deliveredWatts: 1600, slipLossWatts: 400 },
} satisfies ToolExample<Input, Output>;
export const tractorPowerDrawbarSlipTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/tractor-power-drawbar-slip-term",
    title: "Tractor Power Drawbar Slip Term Tool",
    description:
      "Calculate tractor power drawbar slip term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pullNewtons: { type: "number", minimum: 0 },
        theoreticalMetersPerSecond: { type: "number", minimum: 0 },
        slip: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["pullNewtons", "theoreticalMetersPerSecond", "slip"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealWatts: { type: "number" },
        deliveredWatts: { type: "number" },
        slipLossWatts: { type: "number" },
      },
      required: ["idealWatts", "deliveredWatts", "slipLossWatts"],
    },
    ports: {
      inputs: [
        {
          id: "pullNewtons",
          label: "Pull Newtons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "theoreticalMetersPerSecond",
          label: "Theoretical Meters Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slip",
          label: "Slip",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "idealWatts",
          label: "Ideal Watts",
          valueType: { type: "number" },
        },
        {
          id: "deliveredWatts",
          label: "Delivered Watts",
          valueType: { type: "number" },
        },
        {
          id: "slipLossWatts",
          label: "Slip Loss Watts",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tractorPowerDrawbarSlipTermTool.execute;
export default tractorPowerDrawbarSlipTermTool;
