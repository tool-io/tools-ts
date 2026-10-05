import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lessCount: number;
  readonly equalCount: number;
  readonly sampleSize: number;
};
export type Output = {
  readonly lowerPercentile: number;
  readonly upperPercentile: number;
  readonly midrankPercentile: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lessCount: { type: "integer", minimum: 0 },
    equalCount: { type: "integer", minimum: 0 },
    sampleSize: { type: "integer", minimum: 1 },
  },
  required: ["lessCount", "equalCount", "sampleSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerPercentile: { type: "number" },
    upperPercentile: { type: "number" },
    midrankPercentile: { type: "number" },
  },
  required: ["lowerPercentile", "upperPercentile", "midrankPercentile"],
} as const;
/** Describe lower, upper and midrank percentile positions for an explicitly supplied tie block, with strict-less and equal counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lessCount, equalCount, sampleSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampleSize) &&
        sampleSize >= 1 &&
        sampleSize <= Number.MAX_SAFE_INTEGER,
      "sampleSize",
    ),
      sampleSize);
    (H.domain(
      Number.isSafeInteger(lessCount) &&
        lessCount >= 0 &&
        lessCount <= sampleSize,
      "lessCount",
    ),
      lessCount);
    (H.domain(
      Number.isSafeInteger(equalCount) &&
        equalCount >= 0 &&
        equalCount <= sampleSize - lessCount,
      "equalCount",
    ),
      equalCount);
    return {
      lowerPercentile: (100 * lessCount) / sampleSize,
      upperPercentile: (100 * (lessCount + equalCount)) / sampleSize,
      midrankPercentile: (100 * (lessCount + equalCount / 2)) / sampleSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lessCount: 3, equalCount: 2, sampleSize: 10 },
  output: { lowerPercentile: 30, upperPercentile: 50, midrankPercentile: 40 },
} satisfies ToolExample<Input, Output>;
export const percentilePositionTieLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/percentile-position-tie-label",
    title: "Percentile Position Tie Label Tool",
    description:
      "Describe lower, upper and midrank percentile positions for an explicitly supplied tie block, with strict-less and equal counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lessCount: { type: "integer", minimum: 0 },
        equalCount: { type: "integer", minimum: 0 },
        sampleSize: { type: "integer", minimum: 1 },
      },
      required: ["lessCount", "equalCount", "sampleSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerPercentile: { type: "number" },
        upperPercentile: { type: "number" },
        midrankPercentile: { type: "number" },
      },
      required: ["lowerPercentile", "upperPercentile", "midrankPercentile"],
    },
    ports: {
      inputs: [
        {
          id: "lessCount",
          label: "Less Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "equalCount",
          label: "Equal Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleSize",
          label: "Sample Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lowerPercentile",
          label: "Lower Percentile",
          valueType: { type: "number" },
        },
        {
          id: "upperPercentile",
          label: "Upper Percentile",
          valueType: { type: "number" },
        },
        {
          id: "midrankPercentile",
          label: "Midrank Percentile",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = percentilePositionTieLabelTool.execute;
export default percentilePositionTieLabelTool;
