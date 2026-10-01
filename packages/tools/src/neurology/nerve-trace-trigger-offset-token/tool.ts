import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly triggerIndex: number;
  readonly samplePeriod: number;
  readonly suppliedLatencyOffset: number;
};
export type Output = {
  readonly elapsed: number;
  readonly correctedElapsed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer" },
    triggerIndex: { type: "integer" },
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
    suppliedLatencyOffset: { type: "number" },
  },
  required: [
    "sampleIndex",
    "triggerIndex",
    "samplePeriod",
    "suppliedLatencyOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    correctedElapsed: { type: "number" },
  },
  required: ["elapsed", "correctedElapsed"],
} as const;
/** Compute signed trace timing relative to a supplied trigger and offset, without a nerve-conduction interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndex, triggerIndex, samplePeriod, suppliedLatencyOffset } =
    request;
  const compute = (): Output => {
    H.positive(samplePeriod);
    return {
      elapsed: (sampleIndex - triggerIndex) * samplePeriod,
      correctedElapsed:
        (sampleIndex - triggerIndex) * samplePeriod - suppliedLatencyOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIndex: 120,
    triggerIndex: 100,
    samplePeriod: 0.5,
    suppliedLatencyOffset: 2,
  },
  output: { elapsed: 10, correctedElapsed: 8 },
} satisfies ToolExample<Input, Output>;
export const nerveTraceTriggerOffsetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/nerve-trace-trigger-offset-token",
    title: "Nerve Trace Trigger Offset Token Tool",
    description:
      "Compute signed trace timing relative to a supplied trigger and offset, without a nerve-conduction interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndex: { type: "integer" },
        triggerIndex: { type: "integer" },
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
        suppliedLatencyOffset: { type: "number" },
      },
      required: [
        "sampleIndex",
        "triggerIndex",
        "samplePeriod",
        "suppliedLatencyOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        correctedElapsed: { type: "number" },
      },
      required: ["elapsed", "correctedElapsed"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "triggerIndex",
          label: "Trigger Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLatencyOffset",
          label: "Supplied Latency Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "correctedElapsed",
          label: "Corrected Elapsed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nerveTraceTriggerOffsetTokenTool.execute;
export default nerveTraceTriggerOffsetTokenTool;
