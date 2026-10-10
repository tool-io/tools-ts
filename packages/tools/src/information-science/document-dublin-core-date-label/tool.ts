import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly dateText: string;
  readonly dateRole: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    dateRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "dateText", "dateRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label supplied descriptive date text and role without validating a Dublin Core encoding scheme. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, dateText, dateRole } = request;
  const compute = (): Output => {
    H.domain(
      documentId.length > 0 && dateText.length > 0 && dateRole.length > 0,
      "documentId",
    );
    return {
      label: documentId + "; " + dateRole + "=" + JSON.stringify(dateText),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "DOC17", dateText: "2026-11", dateRole: "issued" },
  output: { label: 'DOC17; issued="2026-11"' },
} satisfies ToolExample<Input, Output>;
export const documentDublinCoreDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/document-dublin-core-date-label",
    title: "Document Dublin Core Date Label",
    description:
      "Label supplied descriptive date text and role without validating a Dublin Core encoding scheme.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        dateRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "dateText", "dateRole"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateRole",
          label: "Date Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = documentDublinCoreDateLabelTool.execute;
export default documentDublinCoreDateLabelTool;
