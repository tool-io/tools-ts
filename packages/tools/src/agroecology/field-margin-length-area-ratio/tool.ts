import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marginLengthMeters: number;
  readonly fieldAreaHectares: number;
};
export type Output = { readonly metersPerHectare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginLengthMeters: { type: "number", minimum: 0 },
    fieldAreaHectares: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["marginLengthMeters", "fieldAreaHectares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { metersPerHectare: { type: "number" } },
  required: ["metersPerHectare"],
} as const;
/** Normalize an explicitly measured field-margin length by a positive field area in hectares. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marginLengthMeters, fieldAreaHectares } = request;
  const compute = (): Output => {
    H.domain(marginLengthMeters >= 0, "marginLengthMeters");
    (H.domain(fieldAreaHectares > 0, "fieldAreaHectares"), fieldAreaHectares);
    return { metersPerHectare: marginLengthMeters / fieldAreaHectares };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marginLengthMeters: 600, fieldAreaHectares: 12 },
  output: { metersPerHectare: 50 },
} satisfies ToolExample<Input, Output>;
export const fieldMarginLengthAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/field-margin-length-area-ratio",
    title: "Field Margin Length Area Ratio",
    description:
      "Normalize an explicitly measured field-margin length by a positive field area in hectares.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginLengthMeters: { type: "number", minimum: 0 },
        fieldAreaHectares: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["marginLengthMeters", "fieldAreaHectares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { metersPerHectare: { type: "number" } },
      required: ["metersPerHectare"],
    },
    ports: {
      inputs: [
        {
          id: "marginLengthMeters",
          label: "Margin Length Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fieldAreaHectares",
          label: "Field Area Hectares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "metersPerHectare",
          label: "Meters Per Hectare",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldMarginLengthAreaRatioTool.execute;
export default fieldMarginLengthAreaRatioTool;
