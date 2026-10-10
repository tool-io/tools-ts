import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: boolean;
  readonly traceReported: boolean;
  readonly measuredDepth: number;
};
export type Output = {
  readonly status: string;
  readonly recordedDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "boolean" },
    traceReported: { type: "boolean" },
    measuredDepth: { type: "number", minimum: 0 },
  },
  required: ["observed", "traceReported", "measuredDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", maxLength: 8192 },
    recordedDepth: { type: "number" },
  },
  required: ["status", "recordedDepth"],
} as const;
/** Keep explicit trace, measured, and missing precipitation flags separate without assigning a numeric trace amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, traceReported, measuredDepth } = request;
  const compute = (): Output => {
    H.domain(measuredDepth >= 0, "measuredDepth");
    H.domain(!traceReported || observed, "traceReported");
    return {
      status: !observed ? "missing" : traceReported ? "trace" : "measured",
      recordedDepth: observed && !traceReported ? measuredDepth : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: true, traceReported: true, measuredDepth: 0 },
  output: { status: "trace", recordedDepth: 0 },
} satisfies ToolExample<Input, Output>;
export const precipitationTraceDetectionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/precipitation-trace-detection-token",
    title: "Precipitation Trace Detection Token",
    description:
      "Keep explicit trace, measured, and missing precipitation flags separate without assigning a numeric trace amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "boolean" },
        traceReported: { type: "boolean" },
        measuredDepth: { type: "number", minimum: 0 },
      },
      required: ["observed", "traceReported", "measuredDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", maxLength: 8192 },
        recordedDepth: { type: "number" },
      },
      required: ["status", "recordedDepth"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "traceReported",
          label: "Trace Reported",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "measuredDepth",
          label: "Measured Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
        {
          id: "recordedDepth",
          label: "Recorded Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = precipitationTraceDetectionTokenTool.execute;
export default precipitationTraceDetectionTokenTool;
