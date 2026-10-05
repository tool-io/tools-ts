import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeId: string;
  readonly source: string;
  readonly publicationDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeId: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    publicationDate: { type: "string", maxLength: 8192 },
  },
  required: ["noticeId", "source", "publicationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied public-notice source and date without verifying the notice or current applicability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeId, source, publicationDate } = request;
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
    H.domain(noticeId.length > 0 && source.length > 0, "noticeId");
    namedDate(publicationDate, "publicationDate");
    return {
      label: noticeId + " [" + source + "; published " + publicationDate + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noticeId: "N17", source: "Agency A", publicationDate: "2026-11-01" },
  output: { label: "N17 [Agency A; published 2026-11-01]" },
} satisfies ToolExample<Input, Output>;
export const publicNoticeSourceDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/public-notice-source-date-label",
    title: "Public Notice Source Date Label Tool",
    description:
      "Label a supplied public-notice source and date without verifying the notice or current applicability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeId: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        publicationDate: { type: "string", maxLength: 8192 },
      },
      required: ["noticeId", "source", "publicationDate"],
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
          id: "noticeId",
          label: "Notice Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicationDate",
          label: "Publication Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicNoticeSourceDateLabelTool.execute;
export default publicNoticeSourceDateLabelTool;
