import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldId: string;
  readonly areaValueText: string;
  readonly areaUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldId: { type: "string", maxLength: 8192, minLength: 1 },
    areaValueText: { type: "string", maxLength: 8192, minLength: 1 },
    areaUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fieldId", "areaValueText", "areaUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit field area and unit text without converting units or calculating boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldId, areaValueText, areaUnit } = request;
  const compute = (): Output => {
    H.domain(fieldId.length > 0, "fieldId");
    H.domain(areaValueText.length > 0, "areaValueText");
    H.domain(areaUnit.length > 0, "areaUnit");
    return { token: JSON.stringify([fieldId, areaValueText, areaUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldId: "F17", areaValueText: "12.5", areaUnit: "ha" },
  output: { token: '["F17","12.5","ha"]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalAreaUnitTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroinformatics", "agriculture"],
      keywords: ["agroinformatics", "agriculture"],
    },
    id: "agroinformatics/agricultural-area-unit-tag",
    title: "Agricultural Area Unit Tag",
    description:
      "Preserve explicit field area and unit text without converting units or calculating boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldId: { type: "string", maxLength: 8192, minLength: 1 },
        areaValueText: { type: "string", maxLength: 8192, minLength: 1 },
        areaUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fieldId", "areaValueText", "areaUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "fieldId",
          label: "Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "areaValueText",
          label: "Area Value Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "areaUnit",
          label: "Area Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agriculturalAreaUnitTagTool.execute;
export default agriculturalAreaUnitTagTool;
