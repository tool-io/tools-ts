import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowPerMinute: number;
  readonly minutes: number;
  readonly bypassFraction: number;
  readonly ratedVolume: number;
  readonly priorVolume: number;
};
export type Output = {
  readonly totalVolume: number;
  readonly filteredVolume: number;
  readonly remainingRatedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowPerMinute: { type: "number", minimum: 0 },
    minutes: { type: "number", minimum: 0 },
    bypassFraction: { type: "number", minimum: 0, maximum: 1 },
    ratedVolume: { type: "number", minimum: 0 },
    priorVolume: { type: "number", minimum: 0 },
  },
  required: [
    "flowPerMinute",
    "minutes",
    "bypassFraction",
    "ratedVolume",
    "priorVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number" },
    filteredVolume: { type: "number" },
    remainingRatedVolume: { type: "number" },
  },
  required: ["totalVolume", "filteredVolume", "remainingRatedVolume"],
} as const;
/** Calculate household water filter throughput factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowPerMinute, minutes, bypassFraction, ratedVolume, priorVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      flowPerMinute >= 0 &&
        minutes >= 0 &&
        ratedVolume >= 0 &&
        priorVolume >= 0,
    );
    H.probability(bypassFraction);
    return {
      totalVolume: flowPerMinute * minutes,
      filteredVolume: flowPerMinute * minutes * (1 - bypassFraction),
      remainingRatedVolume:
        ratedVolume -
        priorVolume -
        flowPerMinute * minutes * (1 - bypassFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowPerMinute: 2,
    minutes: 10,
    bypassFraction: 0.1,
    ratedVolume: 100,
    priorVolume: 50,
  },
  output: { totalVolume: 20, filteredVolume: 18, remainingRatedVolume: 32 },
} satisfies ToolExample<Input, Output>;
export const householdWaterFilterThroughputFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/household-water-filter-throughput-factor",
      title: "Household Water Filter Throughput Factor Tool",
      description:
        "Calculate household water filter throughput factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flowPerMinute: { type: "number", minimum: 0 },
          minutes: { type: "number", minimum: 0 },
          bypassFraction: { type: "number", minimum: 0, maximum: 1 },
          ratedVolume: { type: "number", minimum: 0 },
          priorVolume: { type: "number", minimum: 0 },
        },
        required: [
          "flowPerMinute",
          "minutes",
          "bypassFraction",
          "ratedVolume",
          "priorVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalVolume: { type: "number" },
          filteredVolume: { type: "number" },
          remainingRatedVolume: { type: "number" },
        },
        required: ["totalVolume", "filteredVolume", "remainingRatedVolume"],
      },
      ports: {
        inputs: [
          {
            id: "flowPerMinute",
            label: "Flow Per Minute",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minutes",
            label: "Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bypassFraction",
            label: "Bypass Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ratedVolume",
            label: "Rated Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "priorVolume",
            label: "Prior Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalVolume",
            label: "Total Volume",
            valueType: { type: "number" },
          },
          {
            id: "filteredVolume",
            label: "Filtered Volume",
            valueType: { type: "number" },
          },
          {
            id: "remainingRatedVolume",
            label: "Remaining Rated Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = householdWaterFilterThroughputFactorTool.execute;
export default householdWaterFilterThroughputFactorTool;
