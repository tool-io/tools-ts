import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markedFacadeGapLength: number;
  readonly totalFrontageLength: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedFacadeGapLength: { type: "number", minimum: 0 },
    totalFrontageLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["markedFacadeGapLength", "totalFrontageLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicitly marked facade gap length to compatible total frontage without classifying urban form. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markedFacadeGapLength, totalFrontageLength } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalFrontageLength) && totalFrontageLength > 0,
      "totalFrontageLength",
    ),
      totalFrontageLength);
    H.domain(
      markedFacadeGapLength >= 0 &&
        markedFacadeGapLength <= totalFrontageLength,
      "markedFacadeGapLength",
    );
    return {
      fraction: markedFacadeGapLength / totalFrontageLength,
      remainder: totalFrontageLength - markedFacadeGapLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markedFacadeGapLength: 30, totalFrontageLength: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const urbanBlockFacadeGapFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-planning", "urban planning", "arts and design"],
      keywords: ["urban planning", "arts and design"],
    },
    id: "urban-planning/urban-block-facade-gap-fraction",
    title: "Urban Block Facade Gap Fraction",
    description:
      "Normalize explicitly marked facade gap length to compatible total frontage without classifying urban form.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markedFacadeGapLength: { type: "number", minimum: 0 },
        totalFrontageLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["markedFacadeGapLength", "totalFrontageLength"],
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
          id: "markedFacadeGapLength",
          label: "Marked Facade Gap Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFrontageLength",
          label: "Total Frontage Length",
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
export const run = urbanBlockFacadeGapFractionTool.execute;
export default urbanBlockFacadeGapFractionTool;
