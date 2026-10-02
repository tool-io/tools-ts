import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speed: number;
  readonly sensorLag: number;
  readonly processingLag: number;
  readonly timestampOffset: number;
};
export type Output = { readonly distanceOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number" },
    sensorLag: { type: "number", minimum: 0 },
    processingLag: { type: "number", minimum: 0 },
    timestampOffset: { type: "number" },
  },
  required: ["speed", "sensorLag", "processingLag", "timestampOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distanceOffset: { type: "number" } },
  required: ["distanceOffset"],
} as const;
/** Distance offset for explicit monitor delays and signed clock correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speed, sensorLag, processingLag, timestampOffset } = request;
  const compute = (): Output => {
    H.domain(sensorLag >= 0 && processingLag >= 0);
    return {
      distanceOffset: speed * (sensorLag + processingLag + timestampOffset),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speed: 2, sensorLag: 3, processingLag: 0.5, timestampOffset: -0.5 },
  output: { distanceOffset: 6 },
} satisfies ToolExample<Input, Output>;
export const yieldMonitorFlowlagDistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/yield-monitor-flowlag-distance-term",
    title: "Yield Monitor Flowlag Distance Term Tool",
    description:
      "Distance offset for explicit monitor delays and signed clock correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number" },
        sensorLag: { type: "number", minimum: 0 },
        processingLag: { type: "number", minimum: 0 },
        timestampOffset: { type: "number" },
      },
      required: ["speed", "sensorLag", "processingLag", "timestampOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distanceOffset: { type: "number" } },
      required: ["distanceOffset"],
    },
    ports: {
      inputs: [
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sensorLag",
          label: "Sensor Lag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processingLag",
          label: "Processing Lag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timestampOffset",
          label: "Timestamp Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceOffset",
          label: "Distance Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = yieldMonitorFlowlagDistanceTermTool.execute;
export default yieldMonitorFlowlagDistanceTermTool;
