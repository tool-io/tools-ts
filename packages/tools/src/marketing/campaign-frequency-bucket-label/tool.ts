import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impressions: number;
  readonly cutoffs: readonly number[];
  readonly labels: readonly string[];
};
export type Output = { readonly bucket: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impressions: { type: "integer", minimum: 0 },
    cutoffs: { type: "array", maxItems: 256, items: { type: "integer" } },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["impressions", "cutoffs", "labels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bucket: { type: "string", maxLength: 8192 } },
  required: ["bucket"],
} as const;
/** Assign impression frequency to caller-defined half-open buckets; equality at a cutoff enters the next bucket. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impressions, cutoffs, labels } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(impressions) &&
        impressions >= 0 &&
        impressions <= Number.MAX_SAFE_INTEGER,
      "impressions",
    ),
      impressions);
    H.domain(labels.length === cutoffs.length + 1, "labels");
    cutoffs.forEach((v, i) => {
      H.integer(v, 0);
      H.domain(i === 0 || v > cutoffs[i - 1], "cutoffs");
    });
    let index = 0;
    while (index < cutoffs.length && impressions >= cutoffs[index]) index++;
    return { bucket: labels[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    impressions: 5,
    cutoffs: [1, 4, 8],
    labels: ["none", "low", "medium", "high"],
  },
  output: { bucket: "medium" },
} satisfies ToolExample<Input, Output>;
export const campaignFrequencyBucketLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/campaign-frequency-bucket-label",
    title: "Campaign Frequency Bucket Label Tool",
    description:
      "Assign impression frequency to caller-defined half-open buckets; equality at a cutoff enters the next bucket.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impressions: { type: "integer", minimum: 0 },
        cutoffs: { type: "array", maxItems: 256, items: { type: "integer" } },
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["impressions", "cutoffs", "labels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bucket: { type: "string", maxLength: 8192 } },
      required: ["bucket"],
    },
    ports: {
      inputs: [
        {
          id: "impressions",
          label: "Impressions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cutoffs",
          label: "Cutoffs",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "bucket", label: "Bucket", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = campaignFrequencyBucketLabelTool.execute;
export default campaignFrequencyBucketLabelTool;
