import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentDate: string;
  readonly signatureDate: string;
};
export type Output = {
  readonly signatureOnOrAfterDocument: boolean;
  readonly signedDayGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentDate: { type: "string", maxLength: 8192 },
    signatureDate: { type: "string", maxLength: 8192 },
  },
  required: ["documentDate", "signatureDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureOnOrAfterDocument: { type: "boolean" },
    signedDayGap: { type: "integer" },
  },
  required: ["signatureOnOrAfterDocument", "signedDayGap"],
} as const;
/** Compare explicit export-document and signature calendar dates without determining document validity or customs compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentDate, signatureDate } = request;
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
    return (() => {
      const a = namedDate(documentDate, "documentDate").getTime(),
        b = namedDate(signatureDate, "signatureDate").getTime();
      return {
        signatureOnOrAfterDocument: b >= a,
        signedDayGap: (b - a) / 86400000,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentDate: "2026-10-28", signatureDate: "2026-11-01" },
  output: { signatureOnOrAfterDocument: true, signedDayGap: 4 },
} satisfies ToolExample<Input, Output>;
export const exportDocumentSignatureDateOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/export-document-signature-date-order",
    title: "Export Document Signature Date Order Tool",
    description:
      "Compare explicit export-document and signature calendar dates without determining document validity or customs compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentDate: { type: "string", maxLength: 8192 },
        signatureDate: { type: "string", maxLength: 8192 },
      },
      required: ["documentDate", "signatureDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureOnOrAfterDocument: { type: "boolean" },
        signedDayGap: { type: "integer" },
      },
      required: ["signatureOnOrAfterDocument", "signedDayGap"],
    },
    ports: {
      inputs: [
        {
          id: "documentDate",
          label: "Document Date",
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
          id: "signatureOnOrAfterDocument",
          label: "Signature On Or After Document",
          valueType: { type: "boolean" },
        },
        {
          id: "signedDayGap",
          label: "Signed Day Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = exportDocumentSignatureDateOrderTool.execute;
export default exportDocumentSignatureDateOrderTool;
