import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly version: string;
  readonly obsoleteRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
    obsoleteRecorded: { type: "boolean" },
  },
  required: ["documentId", "version", "obsoleteRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Mark a document version using an explicit obsolescence flag without deciding document validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, version, obsoleteRecorded } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0 && version.length > 0, "documentId");
    return {
      label:
        documentId +
        " " +
        version +
        (obsoleteRecorded ? " [obsolete]" : " [not marked obsolete]"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "DOC17", version: "v2", obsoleteRecorded: true },
  output: { label: "DOC17 v2 [obsolete]" },
} satisfies ToolExample<Input, Output>;
export const qualityDocumentObsoleteMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/quality-document-obsolete-marker",
    title: "Quality Document Obsolete Marker",
    description:
      "Mark a document version using an explicit obsolescence flag without deciding document validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
        obsoleteRecorded: { type: "boolean" },
      },
      required: ["documentId", "version", "obsoleteRecorded"],
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
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "obsoleteRecorded",
          label: "Obsolete Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qualityDocumentObsoleteMarkerTool.execute;
export default qualityDocumentObsoleteMarkerTool;
