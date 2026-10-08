import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultCode: string;
  readonly unit: string;
  readonly specimenBasis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultCode: { type: "string", maxLength: 8192, minLength: 1 },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
    specimenBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultCode", "unit", "specimenBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit endocrine-result unit and specimen-basis fields without converting between specimen types. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultCode, unit, specimenBasis } = request;
  const compute = (): Output => {
    H.domain(
      resultCode.length > 0 && unit.length > 0 && specimenBasis.length > 0,
      "resultCode",
    );
    return { label: resultCode + "; " + unit + " [" + specimenBasis + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultCode: "R17", unit: "nmol/L", specimenBasis: "serum" },
  output: { label: "R17; nmol/L [serum]" },
} satisfies ToolExample<Input, Output>;
export const endocrineResultUnitBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/endocrine-result-unit-basis-label",
    title: "Endocrine Result Unit Basis Label",
    description:
      "Label explicit endocrine-result unit and specimen-basis fields without converting between specimen types.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultCode: { type: "string", maxLength: 8192, minLength: 1 },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
        specimenBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultCode", "unit", "specimenBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "resultCode",
          label: "Result Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specimenBasis",
          label: "Specimen Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endocrineResultUnitBasisLabelTool.execute;
export default endocrineResultUnitBasisLabelTool;
