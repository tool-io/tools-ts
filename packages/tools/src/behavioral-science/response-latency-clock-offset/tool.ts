import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusTime: number;
  readonly responseTime: number;
  readonly suppliedResponseOffset: number;
};
export type Output = { readonly latency: number; readonly negative: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusTime: { type: "number" },
    responseTime: { type: "number" },
    suppliedResponseOffset: { type: "number" },
  },
  required: ["stimulusTime", "responseTime", "suppliedResponseOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latency: { type: "number" }, negative: { type: "boolean" } },
  required: ["latency", "negative"],
} as const;
/** Compute a signed supplied research response latency after explicit clock normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusTime, responseTime, suppliedResponseOffset } = request;
  const compute = (): Output => {
    return {
      latency: responseTime - suppliedResponseOffset - stimulusTime,
      negative: responseTime - suppliedResponseOffset < stimulusTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimulusTime: 100, responseTime: 130, suppliedResponseOffset: 5 },
  output: { latency: 25, negative: false },
} satisfies ToolExample<Input, Output>;
export const responseLatencyClockOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/response-latency-clock-offset",
    title: "Response Latency Clock Offset Tool",
    description:
      "Compute a signed supplied research response latency after explicit clock normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusTime: { type: "number" },
        responseTime: { type: "number" },
        suppliedResponseOffset: { type: "number" },
      },
      required: ["stimulusTime", "responseTime", "suppliedResponseOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latency: { type: "number" },
        negative: { type: "boolean" },
      },
      required: ["latency", "negative"],
    },
    ports: {
      inputs: [
        {
          id: "stimulusTime",
          label: "Stimulus Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedResponseOffset",
          label: "Supplied Response Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "latency", label: "Latency", valueType: { type: "number" } },
        { id: "negative", label: "Negative", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = responseLatencyClockOffsetTool.execute;
export default responseLatencyClockOffsetTool;
