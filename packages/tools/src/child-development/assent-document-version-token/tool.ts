import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly delimiter: string };
export type Output = {
  readonly documentToken: string;
  readonly versionToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentToken: { type: "string", maxLength: 8192 },
    versionToken: { type: "string", maxLength: 8192 },
  },
  required: ["documentToken", "versionToken"],
} as const;
/** Split an opaque supplied assent-document version without determining consent adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, delimiter } = request;
  const compute = (): Output => {
    H.domain(delimiter.length > 0);
    const i = reference.lastIndexOf(delimiter);
    H.domain(i > 0 && i + delimiter.length < reference.length);
    return {
      documentToken: reference.slice(0, i),
      versionToken: reference.slice(i + delimiter.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "assent:v2", delimiter: ":" },
  output: { documentToken: "assent", versionToken: "v2" },
} satisfies ToolExample<Input, Output>;
export const assentDocumentVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/assent-document-version-token",
    title: "Assent Document Version Token Tool",
    description:
      "Split an opaque supplied assent-document version without determining consent adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentToken: { type: "string", maxLength: 8192 },
        versionToken: { type: "string", maxLength: 8192 },
      },
      required: ["documentToken", "versionToken"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "documentToken",
          label: "Document Token",
          valueType: { type: "string" },
        },
        {
          id: "versionToken",
          label: "Version Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = assentDocumentVersionTokenTool.execute;
export default assentDocumentVersionTokenTool;
