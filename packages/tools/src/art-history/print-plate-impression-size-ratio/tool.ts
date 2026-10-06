import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plateWidth: number;
  readonly plateHeight: number;
  readonly impressionWidth: number;
  readonly impressionHeight: number;
};
export type Output = {
  readonly widthRatio: number;
  readonly heightRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plateWidth: { type: "number", exclusiveMinimum: 0 },
    plateHeight: { type: "number", exclusiveMinimum: 0 },
    impressionWidth: { type: "number", minimum: 0 },
    impressionHeight: { type: "number", minimum: 0 },
  },
  required: [
    "plateWidth",
    "plateHeight",
    "impressionWidth",
    "impressionHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthRatio: { type: "number" },
    heightRatio: { type: "number" },
  },
  required: ["widthRatio", "heightRatio"],
} as const;
/** Compare explicit impression and plate dimensions axis by axis without assessing authenticity or image scaling history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plateWidth, plateHeight, impressionWidth, impressionHeight } =
    request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(plateWidth) && plateWidth > 0, "plateWidth"),
      plateWidth);
    (H.domain(Number.isFinite(plateHeight) && plateHeight > 0, "plateHeight"),
      plateHeight);
    H.domain(impressionWidth >= 0 && impressionHeight >= 0, "impressionWidth");
    return {
      widthRatio: impressionWidth / plateWidth,
      heightRatio: impressionHeight / plateHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plateWidth: 20,
    plateHeight: 30,
    impressionWidth: 18,
    impressionHeight: 27,
  },
  output: { widthRatio: 0.9, heightRatio: 0.9 },
} satisfies ToolExample<Input, Output>;
export const printPlateImpressionSizeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-history", "art history", "arts and design"],
      keywords: ["art history", "arts and design"],
    },
    id: "art-history/print-plate-impression-size-ratio",
    title: "Print Plate Impression Size Ratio",
    description:
      "Compare explicit impression and plate dimensions axis by axis without assessing authenticity or image scaling history.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plateWidth: { type: "number", exclusiveMinimum: 0 },
        plateHeight: { type: "number", exclusiveMinimum: 0 },
        impressionWidth: { type: "number", minimum: 0 },
        impressionHeight: { type: "number", minimum: 0 },
      },
      required: [
        "plateWidth",
        "plateHeight",
        "impressionWidth",
        "impressionHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthRatio: { type: "number" },
        heightRatio: { type: "number" },
      },
      required: ["widthRatio", "heightRatio"],
    },
    ports: {
      inputs: [
        {
          id: "plateWidth",
          label: "Plate Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateHeight",
          label: "Plate Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "impressionWidth",
          label: "Impression Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "impressionHeight",
          label: "Impression Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "widthRatio",
          label: "Width Ratio",
          valueType: { type: "number" },
        },
        {
          id: "heightRatio",
          label: "Height Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printPlateImpressionSizeRatioTool.execute;
export default printPlateImpressionSizeRatioTool;
