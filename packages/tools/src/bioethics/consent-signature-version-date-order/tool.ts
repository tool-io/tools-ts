import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly versionEffectiveDate: string;
  readonly signatureDate: string;
};
export type Output = {
  readonly signatureBeforeVersionDate: boolean;
  readonly signedDaysAfterVersion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionEffectiveDate: { type: "string", maxLength: 8192 },
    signatureDate: { type: "string", maxLength: 8192 },
  },
  required: ["versionEffectiveDate", "signatureDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureBeforeVersionDate: { type: "boolean" },
    signedDaysAfterVersion: { type: "integer" },
  },
  required: ["signatureBeforeVersionDate", "signedDaysAfterVersion"],
} as const;
/** Compare explicit consent-version and signature calendar dates without assessing consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { versionEffectiveDate, signatureDate } = request;
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
    return {
      signatureBeforeVersionDate:
        namedDate(signatureDate, "signatureDate") <
        namedDate(versionEffectiveDate, "versionEffectiveDate"),
      signedDaysAfterVersion:
        (namedDate(signatureDate, "signatureDate").getTime() -
          namedDate(versionEffectiveDate, "versionEffectiveDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { versionEffectiveDate: "2026-10-28", signatureDate: "2026-11-01" },
  output: { signatureBeforeVersionDate: false, signedDaysAfterVersion: 4 },
} satisfies ToolExample<Input, Output>;
export const consentSignatureVersionDateOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bioethics", "research and quality management"],
      keywords: ["bioethics", "research and quality management"],
    },
    id: "bioethics/consent-signature-version-date-order",
    title: "Consent Signature Version Date Order",
    description:
      "Compare explicit consent-version and signature calendar dates without assessing consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionEffectiveDate: { type: "string", maxLength: 8192 },
        signatureDate: { type: "string", maxLength: 8192 },
      },
      required: ["versionEffectiveDate", "signatureDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureBeforeVersionDate: { type: "boolean" },
        signedDaysAfterVersion: { type: "integer" },
      },
      required: ["signatureBeforeVersionDate", "signedDaysAfterVersion"],
    },
    ports: {
      inputs: [
        {
          id: "versionEffectiveDate",
          label: "Version Effective Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signatureDate",
          label: "Signature Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signatureBeforeVersionDate",
          label: "Signature Before Version Date",
          valueType: { type: "boolean" },
        },
        {
          id: "signedDaysAfterVersion",
          label: "Signed Days After Version",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentSignatureVersionDateOrderTool.execute;
export default consentSignatureVersionDateOrderTool;
