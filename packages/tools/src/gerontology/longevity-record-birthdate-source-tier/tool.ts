import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly birthDateText: string;
  readonly suppliedEvidenceTier: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    birthDateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedEvidenceTier: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "birthDateText", "suppliedEvidenceTier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit longevity-record birth-date transcription and supplied evidence tier without age validation or tier assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, birthDateText, suppliedEvidenceTier } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(birthDateText.length > 0, "birthDateText");
    H.domain(suppliedEvidenceTier.length > 0, "suppliedEvidenceTier");
    return {
      token: JSON.stringify([recordId, birthDateText, suppliedEvidenceTier]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    birthDateText: "1900-01-02",
    suppliedEvidenceTier: "source tier A",
  },
  output: { token: '["R17","1900-01-02","source tier A"]' },
} satisfies ToolExample<Input, Output>;
export const longevityRecordBirthdateSourceTierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/longevity-record-birthdate-source-tier",
    title: "Longevity Record Birthdate Source Tier Tool",
    description:
      "Preserve an explicit longevity-record birth-date transcription and supplied evidence tier without age validation or tier assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        birthDateText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedEvidenceTier: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "birthDateText", "suppliedEvidenceTier"],
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
          id: "birthDateText",
          label: "Birth Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEvidenceTier",
          label: "Supplied Evidence Tier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = longevityRecordBirthdateSourceTierTool.execute;
export default longevityRecordBirthdateSourceTierTool;
