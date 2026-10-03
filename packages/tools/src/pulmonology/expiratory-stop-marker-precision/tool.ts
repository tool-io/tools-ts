import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerSeconds: number;
  readonly samplePeriod: number;
  readonly truncated: boolean;
};
export type Output = {
  readonly lowerSeconds: number;
  readonly upperSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerSeconds: { type: "number" },
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
    truncated: { type: "boolean" },
  },
  required: ["markerSeconds", "samplePeriod", "truncated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSeconds: { type: "number" },
    upperSeconds: { type: "number" },
  },
  required: ["lowerSeconds", "upperSeconds"],
} as const;
/** Propagate a supplied truncated or nearest-sample marker convention without evaluating a maneuver. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerSeconds, samplePeriod, truncated } = request;
  const compute = (): Output => {
    H.positive(samplePeriod);
    return {
      lowerSeconds: markerSeconds - (truncated ? 0 : samplePeriod / 2),
      upperSeconds:
        markerSeconds + (truncated ? samplePeriod : samplePeriod / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerSeconds: 5, samplePeriod: 0.2, truncated: true },
  output: { lowerSeconds: 5, upperSeconds: 5.2 },
} satisfies ToolExample<Input, Output>;
export const expiratoryStopMarkerPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/expiratory-stop-marker-precision",
    title: "Expiratory Stop Marker Precision Tool",
    description:
      "Propagate a supplied truncated or nearest-sample marker convention without evaluating a maneuver.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerSeconds: { type: "number" },
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
        truncated: { type: "boolean" },
      },
      required: ["markerSeconds", "samplePeriod", "truncated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSeconds: { type: "number" },
        upperSeconds: { type: "number" },
      },
      required: ["lowerSeconds", "upperSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "markerSeconds",
          label: "Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "truncated",
          label: "Truncated",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerSeconds",
          label: "Lower Seconds",
          valueType: { type: "number" },
        },
        {
          id: "upperSeconds",
          label: "Upper Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = expiratoryStopMarkerPrecisionTool.execute;
export default expiratoryStopMarkerPrecisionTool;
