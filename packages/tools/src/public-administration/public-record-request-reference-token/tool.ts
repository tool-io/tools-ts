import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorityCode: string;
  readonly year: number;
  readonly sequence: number;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorityCode: { type: "string", maxLength: 8192 },
    year: { type: "integer", minimum: 1, maximum: 9999 },
    sequence: { type: "integer", minimum: 1 },
  },
  required: ["authorityCode", "year", "sequence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format a public-record request reference under an explicit authority/year/sequence convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorityCode, year, sequence } = request;
  const compute = (): Output => {
    H.domain(authorityCode.length > 0, "authorityCode");
    (H.domain(Number.isSafeInteger(year) && year >= 1 && year <= 9999, "year"),
      year);
    (H.domain(
      Number.isSafeInteger(sequence) &&
        sequence >= 1 &&
        sequence <= Number.MAX_SAFE_INTEGER,
      "sequence",
    ),
      sequence);
    return { reference: authorityCode + "/" + year + "/" + sequence };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorityCode: "AUTH-A", year: 2026, sequence: 17 },
  output: { reference: "AUTH-A/2026/17" },
} satisfies ToolExample<Input, Output>;
export const publicRecordRequestReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/public-record-request-reference-token",
    title: "Public Record Request Reference Token Tool",
    description:
      "Format a public-record request reference under an explicit authority/year/sequence convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorityCode: { type: "string", maxLength: 8192 },
        year: { type: "integer", minimum: 1, maximum: 9999 },
        sequence: { type: "integer", minimum: 1 },
      },
      required: ["authorityCode", "year", "sequence"],
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
          id: "authorityCode",
          label: "Authority Code",
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
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicRecordRequestReferenceTokenTool.execute;
export default publicRecordRequestReferenceTokenTool;
