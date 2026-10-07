import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distanceMillimeters: number;
  readonly paperSpeedMillimetersPerSecond: number;
};
export type Output = {
  readonly durationSeconds: number;
  readonly durationMilliseconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceMillimeters: { type: "number", minimum: 0 },
    paperSpeedMillimetersPerSecond: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distanceMillimeters", "paperSpeedMillimetersPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationSeconds: { type: "number" },
    durationMilliseconds: { type: "number" },
  },
  required: ["durationSeconds", "durationMilliseconds"],
} as const;
/** Convert an explicitly measured ECG paper distance to duration using a supplied paper speed without interpreting intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distanceMillimeters, paperSpeedMillimetersPerSecond } = request;
  const compute = (): Output => {
    H.domain(distanceMillimeters >= 0, "distanceMillimeters");
    (H.domain(
      paperSpeedMillimetersPerSecond > 0,
      "paperSpeedMillimetersPerSecond",
    ),
      paperSpeedMillimetersPerSecond);
    return {
      durationSeconds: distanceMillimeters / paperSpeedMillimetersPerSecond,
      durationMilliseconds:
        (1000 * distanceMillimeters) / paperSpeedMillimetersPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distanceMillimeters: 10, paperSpeedMillimetersPerSecond: 25 },
  output: { durationSeconds: 0.4, durationMilliseconds: 400 },
} satisfies ToolExample<Input, Output>;
export const ecgPaperSpeedDistanceCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/ecg-paper-speed-distance-crosswalk",
    title: "ECG Paper Speed Distance Crosswalk",
    description:
      "Convert an explicitly measured ECG paper distance to duration using a supplied paper speed without interpreting intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceMillimeters: { type: "number", minimum: 0 },
        paperSpeedMillimetersPerSecond: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distanceMillimeters", "paperSpeedMillimetersPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationSeconds: { type: "number" },
        durationMilliseconds: { type: "number" },
      },
      required: ["durationSeconds", "durationMilliseconds"],
    },
    ports: {
      inputs: [
        {
          id: "distanceMillimeters",
          label: "Distance Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paperSpeedMillimetersPerSecond",
          label: "Paper Speed Millimeters Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
        {
          id: "durationMilliseconds",
          label: "Duration Milliseconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecgPaperSpeedDistanceCrosswalkTool.execute;
export default ecgPaperSpeedDistanceCrosswalkTool;
