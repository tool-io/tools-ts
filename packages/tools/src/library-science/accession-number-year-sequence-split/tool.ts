import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly year: number; readonly sequence: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    sequence: { type: "string", maxLength: 8192 },
  },
  required: ["year", "sequence"],
} as const;
/** Parse the explicit YYYY.decimal-sequence accession syntax, preserving sequence leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([0-9]{4})\.([0-9]+)(?![\s\S])/.exec(token);
    H.domain(match !== null);
    return { year: Number(match[1]), sequence: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "2026.00042" },
  output: { year: 2026, sequence: "00042" },
} satisfies ToolExample<Input, Output>;
export const accessionNumberYearSequenceSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/accession-number-year-sequence-split",
    title: "Accession Number Year Sequence Split Tool",
    description:
      "Parse the explicit YYYY.decimal-sequence accession syntax, preserving sequence leading zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        sequence: { type: "string", maxLength: 8192 },
      },
      required: ["year", "sequence"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "sequence", label: "Sequence", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = accessionNumberYearSequenceSplitTool.execute;
export default accessionNumberYearSequenceSplitTool;
