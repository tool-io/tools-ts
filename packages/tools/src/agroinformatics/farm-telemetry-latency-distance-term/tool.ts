import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latencySeconds: number;
  readonly speedMetersPerSecond: number;
  readonly acceleration: number;
};
export type Output = {
  readonly constantSpeedDistance: number;
  readonly acceleratedDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latencySeconds: { type: "number", minimum: 0 },
    speedMetersPerSecond: { type: "number" },
    acceleration: { type: "number" },
  },
  required: ["latencySeconds", "speedMetersPerSecond", "acceleration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    constantSpeedDistance: { type: "number" },
    acceleratedDistance: { type: "number" },
  },
  required: ["constantSpeedDistance", "acceleratedDistance"],
} as const;
/** Calculate farm telemetry latency distance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latencySeconds, speedMetersPerSecond, acceleration } = request;
  const compute = (): Output => {
    H.domain(latencySeconds >= 0);
    return {
      constantSpeedDistance: speedMetersPerSecond * latencySeconds,
      acceleratedDistance:
        speedMetersPerSecond * latencySeconds +
        (acceleration * latencySeconds ** 2) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latencySeconds: 2, speedMetersPerSecond: 3, acceleration: 1 },
  output: { constantSpeedDistance: 6, acceleratedDistance: 8 },
} satisfies ToolExample<Input, Output>;
export const farmTelemetryLatencyDistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-telemetry-latency-distance-term",
    title: "Farm Telemetry Latency Distance Term Tool",
    description:
      "Calculate farm telemetry latency distance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latencySeconds: { type: "number", minimum: 0 },
        speedMetersPerSecond: { type: "number" },
        acceleration: { type: "number" },
      },
      required: ["latencySeconds", "speedMetersPerSecond", "acceleration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        constantSpeedDistance: { type: "number" },
        acceleratedDistance: { type: "number" },
      },
      required: ["constantSpeedDistance", "acceleratedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "latencySeconds",
          label: "Latency Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speedMetersPerSecond",
          label: "Speed Meters Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceleration",
          label: "Acceleration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "constantSpeedDistance",
          label: "Constant Speed Distance",
          valueType: { type: "number" },
        },
        {
          id: "acceleratedDistance",
          label: "Accelerated Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmTelemetryLatencyDistanceTermTool.execute;
export default farmTelemetryLatencyDistanceTermTool;
