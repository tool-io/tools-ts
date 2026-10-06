import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly captionVisibleSeconds: number;
  readonly creativeDurationSeconds: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captionVisibleSeconds: { type: "number", minimum: 0 },
    creativeDurationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["captionVisibleSeconds", "creativeDurationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit caption-visible duration to compatible creative duration without evaluating accessibility or legal disclosure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { captionVisibleSeconds, creativeDurationSeconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(creativeDurationSeconds) && creativeDurationSeconds > 0,
      "creativeDurationSeconds",
    ),
      creativeDurationSeconds);
    H.domain(
      captionVisibleSeconds >= 0 &&
        captionVisibleSeconds <= creativeDurationSeconds,
      "captionVisibleSeconds",
    );
    return {
      fraction: captionVisibleSeconds / creativeDurationSeconds,
      remainder: creativeDurationSeconds - captionVisibleSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { captionVisibleSeconds: 30, creativeDurationSeconds: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const adCreativeCaptionDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/ad-creative-caption-duration-share",
    title: "Ad Creative Caption Duration Share",
    description:
      "Normalize explicit caption-visible duration to compatible creative duration without evaluating accessibility or legal disclosure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        captionVisibleSeconds: { type: "number", minimum: 0 },
        creativeDurationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["captionVisibleSeconds", "creativeDurationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "captionVisibleSeconds",
          label: "Caption Visible Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creativeDurationSeconds",
          label: "Creative Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = adCreativeCaptionDurationShareTool.execute;
export default adCreativeCaptionDurationShareTool;
