import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delaySamples: number;
  readonly samplePeriodSeconds: number;
};
export type Output = { readonly delaySeconds: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delaySamples: { type: "integer", minimum: 0 },
    samplePeriodSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["delaySamples", "samplePeriodSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delaySeconds: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["delaySeconds", "label"],
} as const;
/** Label a discrete feedback delay and convert an explicit sample period to seconds without estimating latency from signals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delaySamples, samplePeriodSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(delaySamples) &&
        delaySamples >= 0 &&
        delaySamples <= Number.MAX_SAFE_INTEGER,
      "delaySamples",
    ),
      delaySamples);
    (H.domain(samplePeriodSeconds > 0, "samplePeriodSeconds"),
      samplePeriodSeconds);
    return {
      delaySeconds: delaySamples * samplePeriodSeconds,
      label: delaySamples + " samples at " + samplePeriodSeconds + " s/sample",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delaySamples: 3, samplePeriodSeconds: 0.02 },
  output: { delaySeconds: 0.06, label: "3 samples at 0.02 s/sample" },
} satisfies ToolExample<Input, Output>;
export const feedbackDelaySampleCountLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/feedback-delay-sample-count-label",
    title: "Feedback Delay Sample Count Label",
    description:
      "Label a discrete feedback delay and convert an explicit sample period to seconds without estimating latency from signals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delaySamples: { type: "integer", minimum: 0 },
        samplePeriodSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["delaySamples", "samplePeriodSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delaySeconds: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["delaySeconds", "label"],
    },
    ports: {
      inputs: [
        {
          id: "delaySamples",
          label: "Delay Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "samplePeriodSeconds",
          label: "Sample Period Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "delaySeconds",
          label: "Delay Seconds",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = feedbackDelaySampleCountLabelTool.execute;
export default feedbackDelaySampleCountLabelTool;
