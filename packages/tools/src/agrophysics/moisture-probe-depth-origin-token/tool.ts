import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDepth: number;
  readonly sensorOrigin: number;
  readonly referenceOrigin: number;
  readonly positiveDown: boolean;
};
export type Output = { readonly referenceDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDepth: { type: "number" },
    sensorOrigin: { type: "number" },
    referenceOrigin: { type: "number" },
    positiveDown: { type: "boolean" },
  },
  required: [
    "recordedDepth",
    "sensorOrigin",
    "referenceOrigin",
    "positiveDown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceDepth: { type: "number" } },
  required: ["referenceDepth"],
} as const;
/** Translate supplied probe depths with explicit depth-axis orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDepth, sensorOrigin, referenceOrigin, positiveDown } =
    request;
  const compute = (): Output => {
    return {
      referenceDepth:
        recordedDepth +
        (sensorOrigin - referenceOrigin) * (positiveDown ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedDepth: 10,
    sensorOrigin: 3,
    referenceOrigin: 1,
    positiveDown: true,
  },
  output: { referenceDepth: 12 },
} satisfies ToolExample<Input, Output>;
export const moistureProbeDepthOriginTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/moisture-probe-depth-origin-token",
    title: "Moisture Probe Depth Origin Token Tool",
    description:
      "Translate supplied probe depths with explicit depth-axis orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDepth: { type: "number" },
        sensorOrigin: { type: "number" },
        referenceOrigin: { type: "number" },
        positiveDown: { type: "boolean" },
      },
      required: [
        "recordedDepth",
        "sensorOrigin",
        "referenceOrigin",
        "positiveDown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceDepth: { type: "number" } },
      required: ["referenceDepth"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDepth",
          label: "Recorded Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sensorOrigin",
          label: "Sensor Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOrigin",
          label: "Reference Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveDown",
          label: "Positive Down",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "referenceDepth",
          label: "Reference Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = moistureProbeDepthOriginTokenTool.execute;
export default moistureProbeDepthOriginTokenTool;
