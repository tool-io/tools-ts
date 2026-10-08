import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly courtCode: string;
  readonly year: number;
  readonly sequence: string;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courtCode: { type: "string", maxLength: 8192, minLength: 1 },
    year: { type: "integer", minimum: 1, maximum: 9999 },
    sequence: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["courtCode", "year", "sequence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format caller-supplied court, year and case-sequence fields without resolving a court registry or selecting an official jurisdictional format. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { courtCode, year, sequence } = request;
  const compute = (): Output => {
    H.domain(courtCode.length > 0 && sequence.length > 0, "courtCode");
    (H.domain(Number.isSafeInteger(year) && year >= 1 && year <= 9999, "year"),
      year);
    return { reference: courtCode + "/" + year + "/" + sequence };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { courtCode: "COURT-A", year: 2026, sequence: "0017" },
  output: { reference: "COURT-A/2026/0017" },
} satisfies ToolExample<Input, Output>;
export const courtDocketCaseReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/court-docket-case-reference",
    title: "Court Docket Case Reference",
    description:
      "Format caller-supplied court, year and case-sequence fields without resolving a court registry or selecting an official jurisdictional format.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        courtCode: { type: "string", maxLength: 8192, minLength: 1 },
        year: { type: "integer", minimum: 1, maximum: 9999 },
        sequence: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["courtCode", "year", "sequence"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    ports: {
      inputs: [
        {
          id: "courtCode",
          label: "Court Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sequence",
          label: "Sequence",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = courtDocketCaseReferenceTool.execute;
export default courtDocketCaseReferenceTool;
