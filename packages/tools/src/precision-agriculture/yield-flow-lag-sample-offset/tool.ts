import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delaySeconds: number;
  readonly sampleRate: number;
  readonly rounding: string;
};
export type Output = { readonly sampleOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delaySeconds: { type: "number", minimum: 0 },
    sampleRate: { type: "number", exclusiveMinimum: 0 },
    rounding: {
      type: "string",
      maxLength: 8192,
      enum: ["floor", "ceil", "nearest"],
    },
  },
  required: ["delaySeconds", "sampleRate", "rounding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampleOffset: { type: "integer" } },
  required: ["sampleOffset"],
} as const;
/** Quantize an explicit yield-sensor lag under a supplied rounding policy without estimating sensor latency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delaySeconds, sampleRate, rounding } = request;
  const compute = (): Output => {
    H.domain(
      delaySeconds >= 0 && ["floor", "ceil", "nearest"].includes(rounding),
    );
    H.positive(sampleRate);
    return {
      sampleOffset:
        rounding === "floor"
          ? Math.floor(delaySeconds * sampleRate)
          : rounding === "ceil"
            ? Math.ceil(delaySeconds * sampleRate)
            : Math.round(delaySeconds * sampleRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delaySeconds: 1.25, sampleRate: 2, rounding: "floor" },
  output: { sampleOffset: 2 },
} satisfies ToolExample<Input, Output>;
export const yieldFlowLagSampleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/yield-flow-lag-sample-offset",
    title: "Yield Flow Lag Sample Offset Tool",
    description:
      "Quantize an explicit yield-sensor lag under a supplied rounding policy without estimating sensor latency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delaySeconds: { type: "number", minimum: 0 },
        sampleRate: { type: "number", exclusiveMinimum: 0 },
        rounding: {
          type: "string",
          maxLength: 8192,
          enum: ["floor", "ceil", "nearest"],
        },
      },
      required: ["delaySeconds", "sampleRate", "rounding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sampleOffset: { type: "integer" } },
      required: ["sampleOffset"],
    },
    ports: {
      inputs: [
        {
          id: "delaySeconds",
          label: "Delay Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleRate",
          label: "Sample Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rounding",
          label: "Rounding",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sampleOffset",
          label: "Sample Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = yieldFlowLagSampleOffsetTool.execute;
export default yieldFlowLagSampleOffsetTool;
