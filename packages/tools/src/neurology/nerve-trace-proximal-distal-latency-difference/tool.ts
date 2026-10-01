import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proximalLatency: number;
  readonly distalLatency: number;
  readonly intersiteDistance: number;
};
export type Output = {
  readonly latencyDifference: number;
  readonly segmentVelocity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proximalLatency: { type: "number" },
    distalLatency: { type: "number" },
    intersiteDistance: { type: "number", minimum: 0 },
  },
  required: ["proximalLatency", "distalLatency", "intersiteDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latencyDifference: { type: "number" },
    segmentVelocity: { type: "number" },
  },
  required: ["latencyDifference", "segmentVelocity"],
} as const;
/** Signed supplied two-site latency-difference velocity, without measurement acquisition or a clinical conduction interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proximalLatency, distalLatency, intersiteDistance } = request;
  const compute = (): Output => {
    H.domain(proximalLatency !== distalLatency && intersiteDistance >= 0);
    return {
      latencyDifference: proximalLatency - distalLatency,
      segmentVelocity: intersiteDistance / (proximalLatency - distalLatency),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    proximalLatency: 0.008,
    distalLatency: 0.004,
    intersiteDistance: 0.2,
  },
  output: { latencyDifference: 0.004, segmentVelocity: 50 },
} satisfies ToolExample<Input, Output>;
export const nerveTraceProximalDistalLatencyDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "neurology/nerve-trace-proximal-distal-latency-difference",
      title: "Nerve Trace Proximal Distal Latency Difference Tool",
      description:
        "Signed supplied two-site latency-difference velocity, without measurement acquisition or a clinical conduction interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          proximalLatency: { type: "number" },
          distalLatency: { type: "number" },
          intersiteDistance: { type: "number", minimum: 0 },
        },
        required: ["proximalLatency", "distalLatency", "intersiteDistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latencyDifference: { type: "number" },
          segmentVelocity: { type: "number" },
        },
        required: ["latencyDifference", "segmentVelocity"],
      },
      ports: {
        inputs: [
          {
            id: "proximalLatency",
            label: "Proximal Latency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distalLatency",
            label: "Distal Latency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intersiteDistance",
            label: "Intersite Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "latencyDifference",
            label: "Latency Difference",
            valueType: { type: "number" },
          },
          {
            id: "segmentVelocity",
            label: "Segment Velocity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nerveTraceProximalDistalLatencyDifferenceTool.execute;
export default nerveTraceProximalDistalLatencyDifferenceTool;
