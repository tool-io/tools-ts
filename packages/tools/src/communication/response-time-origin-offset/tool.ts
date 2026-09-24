import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly stimulusTime: number;
  readonly clockOffset: number;
};
export type Output = { readonly latency: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    stimulusTime: { type: "number" },
    clockOffset: { type: "number" },
  },
  required: ["responseTime", "stimulusTime", "clockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latency: { type: "number" } },
  required: ["latency"],
} as const;
/** Subtract an explicit response-clock offset before computing latency; negative values remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseTime, stimulusTime, clockOffset } = request;
  const compute = (): Output => {
    return { latency: responseTime - stimulusTime - clockOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseTime: 120, stimulusTime: 100, clockOffset: 5 },
  output: { latency: 15 },
} satisfies ToolExample<Input, Output>;
export const responseTimeOriginOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/response-time-origin-offset",
    title: "Response Time Origin Offset Tool",
    description:
      "Subtract an explicit response-clock offset before computing latency; negative values remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        stimulusTime: { type: "number" },
        clockOffset: { type: "number" },
      },
      required: ["responseTime", "stimulusTime", "clockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { latency: { type: "number" } },
      required: ["latency"],
    },
    ports: {
      inputs: [
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stimulusTime",
          label: "Stimulus Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockOffset",
          label: "Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "latency", label: "Latency", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = responseTimeOriginOffsetTool.execute;
export default responseTimeOriginOffsetTool;
