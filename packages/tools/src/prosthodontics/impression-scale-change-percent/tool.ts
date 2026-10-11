import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceLength: number;
  readonly measuredLength: number;
};
export type Output = {
  readonly scaleRatio: number;
  readonly signedChangePercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    measuredLength: { type: "number", minimum: 0 },
  },
  required: ["referenceLength", "measuredLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleRatio: { type: "number" },
    signedChangePercent: { type: "number" },
  },
  required: ["scaleRatio", "signedChangePercent"],
} as const;
/** Compare explicit impression and reference lengths without inferring material performance or clinical fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceLength, measuredLength } = request;
  const compute = (): Output => {
    (H.domain(referenceLength > 0, "referenceLength"), referenceLength);
    H.domain(measuredLength >= 0, "measuredLength");
    return {
      scaleRatio: measuredLength / referenceLength,
      signedChangePercent:
        (100 * (measuredLength - referenceLength)) / referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceLength: 100, measuredLength: 99.5 },
  output: { scaleRatio: 0.995, signedChangePercent: -0.5 },
} satisfies ToolExample<Input, Output>;
export const impressionScaleChangePercentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/impression-scale-change-percent",
    title: "Impression Scale Change Percent",
    description:
      "Compare explicit impression and reference lengths without inferring material performance or clinical fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceLength: { type: "number", exclusiveMinimum: 0 },
        measuredLength: { type: "number", minimum: 0 },
      },
      required: ["referenceLength", "measuredLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleRatio: { type: "number" },
        signedChangePercent: { type: "number" },
      },
      required: ["scaleRatio", "signedChangePercent"],
    },
    ports: {
      inputs: [
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLength",
          label: "Measured Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaleRatio",
          label: "Scale Ratio",
          valueType: { type: "number" },
        },
        {
          id: "signedChangePercent",
          label: "Signed Change Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = impressionScaleChangePercentTool.execute;
export default impressionScaleChangePercentTool;
