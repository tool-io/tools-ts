import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleDurationSeconds: number;
  readonly markedDisfluencySeconds: number;
};
export type Output = {
  readonly markedFraction: number;
  readonly otherSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleDurationSeconds: { type: "number", exclusiveMinimum: 0 },
    markedDisfluencySeconds: { type: "number", minimum: 0 },
  },
  required: ["sampleDurationSeconds", "markedDisfluencySeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedFraction: { type: "number" },
    otherSeconds: { type: "number" },
  },
  required: ["markedFraction", "otherSeconds"],
} as const;
/** Normalize an explicitly marked disfluency duration to observed sample time without evaluating fluency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleDurationSeconds, markedDisfluencySeconds } = request;
  const compute = (): Output => {
    (H.domain(sampleDurationSeconds > 0, "sampleDurationSeconds"),
      sampleDurationSeconds);
    H.domain(
      markedDisfluencySeconds >= 0 &&
        markedDisfluencySeconds <= sampleDurationSeconds,
      "markedDisfluencySeconds",
    );
    return {
      markedFraction: markedDisfluencySeconds / sampleDurationSeconds,
      otherSeconds: sampleDurationSeconds - markedDisfluencySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleDurationSeconds: 60, markedDisfluencySeconds: 9 },
  output: { markedFraction: 0.15, otherSeconds: 51 },
} satisfies ToolExample<Input, Output>;
export const fluencyDisfluencyDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/fluency-disfluency-duration",
    title: "Fluency Disfluency Duration",
    description:
      "Normalize an explicitly marked disfluency duration to observed sample time without evaluating fluency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleDurationSeconds: { type: "number", exclusiveMinimum: 0 },
        markedDisfluencySeconds: { type: "number", minimum: 0 },
      },
      required: ["sampleDurationSeconds", "markedDisfluencySeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markedFraction: { type: "number" },
        otherSeconds: { type: "number" },
      },
      required: ["markedFraction", "otherSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sampleDurationSeconds",
          label: "Sample Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markedDisfluencySeconds",
          label: "Marked Disfluency Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "markedFraction",
          label: "Marked Fraction",
          valueType: { type: "number" },
        },
        {
          id: "otherSeconds",
          label: "Other Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fluencyDisfluencyDurationTool.execute;
export default fluencyDisfluencyDurationTool;
