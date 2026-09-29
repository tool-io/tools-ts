import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counter: number;
  readonly lastServiceCounter: number;
  readonly ratedVolume: number;
  readonly bypassVolume: number;
};
export type Output = {
  readonly netThroughput: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counter: { type: "number" },
    lastServiceCounter: { type: "number" },
    ratedVolume: { type: "number", minimum: 0 },
    bypassVolume: { type: "number", minimum: 0 },
  },
  required: ["counter", "lastServiceCounter", "ratedVolume", "bypassVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netThroughput: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["netThroughput", "remaining"],
} as const;
/** Calculate hydroponic filter throughput service gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counter, lastServiceCounter, ratedVolume, bypassVolume } = request;
  const compute = (): Output => {
    H.domain(
      counter >= lastServiceCounter &&
        bypassVolume >= 0 &&
        bypassVolume <= counter - lastServiceCounter &&
        ratedVolume >= 0,
    );
    return {
      netThroughput: counter - lastServiceCounter - bypassVolume,
      remaining: ratedVolume - counter + lastServiceCounter + bypassVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counter: 500,
    lastServiceCounter: 100,
    ratedVolume: 600,
    bypassVolume: 20,
  },
  output: { netThroughput: 380, remaining: 220 },
} satisfies ToolExample<Input, Output>;
export const hydroponicFilterThroughputServiceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/hydroponic-filter-throughput-service-gap",
      title: "Hydroponic Filter Throughput Service Gap Tool",
      description:
        "Calculate hydroponic filter throughput service gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counter: { type: "number" },
          lastServiceCounter: { type: "number" },
          ratedVolume: { type: "number", minimum: 0 },
          bypassVolume: { type: "number", minimum: 0 },
        },
        required: [
          "counter",
          "lastServiceCounter",
          "ratedVolume",
          "bypassVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netThroughput: { type: "number" },
          remaining: { type: "number" },
        },
        required: ["netThroughput", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "counter",
            label: "Counter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lastServiceCounter",
            label: "Last Service Counter",
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
            id: "bypassVolume",
            label: "Bypass Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netThroughput",
            label: "Net Throughput",
            valueType: { type: "number" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydroponicFilterThroughputServiceGapTool.execute;
export default hydroponicFilterThroughputServiceGapTool;
