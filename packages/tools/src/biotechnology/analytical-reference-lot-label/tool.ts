import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceName: string;
  readonly lotCode: string;
  readonly expiryDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceName: { type: "string", maxLength: 8192 },
    lotCode: { type: "string", maxLength: 8192 },
    expiryDate: { type: "string", maxLength: 8192 },
  },
  required: ["referenceName", "lotCode", "expiryDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format supplied analytical reference identity, lot and expiry fields without asserting traceability or current validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceName, lotCode, expiryDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(referenceName.length > 0 && lotCode.length > 0, "referenceName");
    namedDate(expiryDate, "expiryDate");
    return {
      label:
        referenceName +
        "; lot=" +
        JSON.stringify(lotCode) +
        "; expires=" +
        expiryDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceName: "Protein standard",
    lotCode: "L-27",
    expiryDate: "2027-03-31",
  },
  output: { label: 'Protein standard; lot="L-27"; expires=2027-03-31' },
} satisfies ToolExample<Input, Output>;
export const analyticalReferenceLotLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/analytical-reference-lot-label",
    title: "Analytical Reference Lot Label Tool",
    description:
      "Format supplied analytical reference identity, lot and expiry fields without asserting traceability or current validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceName: { type: "string", maxLength: 8192 },
        lotCode: { type: "string", maxLength: 8192 },
        expiryDate: { type: "string", maxLength: 8192 },
      },
      required: ["referenceName", "lotCode", "expiryDate"],
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
          id: "referenceName",
          label: "Reference Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotCode",
          label: "Lot Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = analyticalReferenceLotLabelTool.execute;
export default analyticalReferenceLotLabelTool;
