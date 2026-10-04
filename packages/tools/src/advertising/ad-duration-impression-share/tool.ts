import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adSeconds: number;
  readonly slotSeconds: number;
  readonly impressions: number;
};
export type Output = {
  readonly durationShare: number;
  readonly impressionSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adSeconds: { type: "number", minimum: 0 },
    slotSeconds: { type: "number", exclusiveMinimum: 0 },
    impressions: { type: "integer", minimum: 0 },
  },
  required: ["adSeconds", "slotSeconds", "impressions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationShare: { type: "number" },
    impressionSeconds: { type: "number" },
  },
  required: ["durationShare", "impressionSeconds"],
} as const;
/** Describe an ad's slot-duration share and total nominal impression-seconds under full-play exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { adSeconds, slotSeconds, impressions } = request;
  const compute = (): Output => {
    (H.domain(slotSeconds > 0, "slotSeconds"), slotSeconds);
    H.domain(adSeconds >= 0 && adSeconds <= slotSeconds, "adSeconds");
    (H.domain(
      Number.isSafeInteger(impressions) &&
        impressions >= 0 &&
        impressions <= Number.MAX_SAFE_INTEGER,
      "impressions",
    ),
      impressions);
    return {
      durationShare: adSeconds / slotSeconds,
      impressionSeconds: adSeconds * impressions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { adSeconds: 15, slotSeconds: 60, impressions: 1000 },
  output: { durationShare: 0.25, impressionSeconds: 15000 },
} satisfies ToolExample<Input, Output>;
export const adDurationImpressionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/ad-duration-impression-share",
    title: "Ad Duration Impression Share Tool",
    description:
      "Describe an ad's slot-duration share and total nominal impression-seconds under full-play exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adSeconds: { type: "number", minimum: 0 },
        slotSeconds: { type: "number", exclusiveMinimum: 0 },
        impressions: { type: "integer", minimum: 0 },
      },
      required: ["adSeconds", "slotSeconds", "impressions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationShare: { type: "number" },
        impressionSeconds: { type: "number" },
      },
      required: ["durationShare", "impressionSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "adSeconds",
          label: "Ad Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotSeconds",
          label: "Slot Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "impressions",
          label: "Impressions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "durationShare",
          label: "Duration Share",
          valueType: { type: "number" },
        },
        {
          id: "impressionSeconds",
          label: "Impression Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adDurationImpressionShareTool.execute;
export default adDurationImpressionShareTool;
