import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly regnalYearText: string;
  readonly accessionYearConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    regnalYearText: { type: "string", maxLength: 8192, minLength: 1 },
    accessionYearConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "regnalYearText", "accessionYearConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit regnal-year transcription and accession convention without inferring sovereign chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, regnalYearText, accessionYearConvention } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(regnalYearText.length > 0, "regnalYearText");
    H.domain(accessionYearConvention.length > 0, "accessionYearConvention");
    return {
      token: JSON.stringify([
        recordId,
        regnalYearText,
        accessionYearConvention,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    regnalYearText: "Year 2",
    accessionYearConvention: "Source A convention",
  },
  output: { token: '["R17","Year 2","Source A convention"]' },
} satisfies ToolExample<Input, Output>;
export const regnalAccessionPartialYearSourceTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/regnal-accession-partial-year-source-tag",
      title: "Regnal Accession Partial Year Source Tag",
      description:
        "Preserve an explicit regnal-year transcription and accession convention without inferring sovereign chronology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          regnalYearText: { type: "string", maxLength: 8192, minLength: 1 },
          accessionYearConvention: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["recordId", "regnalYearText", "accessionYearConvention"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "regnalYearText",
            label: "Regnal Year Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "accessionYearConvention",
            label: "Accession Year Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = regnalAccessionPartialYearSourceTagTool.execute;
export default regnalAccessionPartialYearSourceTagTool;
