import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowLitersPerMinute: number;
  readonly speedMetersPerMinute: number;
  readonly swathMeters: number;
};
export type Output = {
  readonly litersPerSquareMeter: number;
  readonly litersPerHa: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowLitersPerMinute: { type: "number", minimum: 0 },
    speedMetersPerMinute: { type: "number", exclusiveMinimum: 0 },
    swathMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flowLitersPerMinute", "speedMetersPerMinute", "swathMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    litersPerSquareMeter: { type: "number" },
    litersPerHa: { type: "number" },
  },
  required: ["litersPerSquareMeter", "litersPerHa"],
} as const;
/** Bench volume/area calibration with no chemical choice or application recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowLitersPerMinute, speedMetersPerMinute, swathMeters } = request;
  const compute = (): Output => {
    H.domain(flowLitersPerMinute >= 0);
    H.positive(speedMetersPerMinute);
    H.positive(swathMeters);
    return {
      litersPerSquareMeter:
        flowLitersPerMinute / (speedMetersPerMinute * swathMeters),
      litersPerHa:
        (10000 * flowLitersPerMinute) / (speedMetersPerMinute * swathMeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowLitersPerMinute: 1,
    speedMetersPerMinute: 100,
    swathMeters: 0.5,
  },
  output: { litersPerSquareMeter: 0.02, litersPerHa: 200 },
} satisfies ToolExample<Input, Output>;
export const sprayerBenchNozzleFlowAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/sprayer-bench-nozzle-flow-area-term",
    title: "Sprayer Bench Nozzle Flow Area Term Tool",
    description:
      "Bench volume/area calibration with no chemical choice or application recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowLitersPerMinute: { type: "number", minimum: 0 },
        speedMetersPerMinute: { type: "number", exclusiveMinimum: 0 },
        swathMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["flowLitersPerMinute", "speedMetersPerMinute", "swathMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        litersPerSquareMeter: { type: "number" },
        litersPerHa: { type: "number" },
      },
      required: ["litersPerSquareMeter", "litersPerHa"],
    },
    ports: {
      inputs: [
        {
          id: "flowLitersPerMinute",
          label: "Flow Liters Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speedMetersPerMinute",
          label: "Speed Meters Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "swathMeters",
          label: "Swath Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "litersPerSquareMeter",
          label: "Liters Per Square Meter",
          valueType: { type: "number" },
        },
        {
          id: "litersPerHa",
          label: "Liters Per Ha",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sprayerBenchNozzleFlowAreaTermTool.execute;
export default sprayerBenchNozzleFlowAreaTermTool;
