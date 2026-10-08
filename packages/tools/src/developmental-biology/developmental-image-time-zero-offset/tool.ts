import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageTimestampSeconds: number;
  readonly timeZeroTimestampSeconds: number;
};
export type Output = { readonly relativeTimeSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageTimestampSeconds: { type: "number" },
    timeZeroTimestampSeconds: { type: "number" },
  },
  required: ["imageTimestampSeconds", "timeZeroTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeTimeSeconds: { type: "number" } },
  required: ["relativeTimeSeconds"],
} as const;
/** Reference a recorded developmental image timestamp to an explicit experimental time zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageTimestampSeconds, timeZeroTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      relativeTimeSeconds: imageTimestampSeconds - timeZeroTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageTimestampSeconds: 1600, timeZeroTimestampSeconds: 1000 },
  output: { relativeTimeSeconds: 600 },
} satisfies ToolExample<Input, Output>;
export const developmentalImageTimeZeroOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/developmental-image-time-zero-offset",
    title: "Developmental Image Time Zero Offset",
    description:
      "Reference a recorded developmental image timestamp to an explicit experimental time zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageTimestampSeconds: { type: "number" },
        timeZeroTimestampSeconds: { type: "number" },
      },
      required: ["imageTimestampSeconds", "timeZeroTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeTimeSeconds: { type: "number" } },
      required: ["relativeTimeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "imageTimestampSeconds",
          label: "Image Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeZeroTimestampSeconds",
          label: "Time Zero Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeTimeSeconds",
          label: "Relative Time Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = developmentalImageTimeZeroOffsetTool.execute;
export default developmentalImageTimeZeroOffsetTool;
