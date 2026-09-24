import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly separator: string };
export type Output = { readonly document: string; readonly version: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    document: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
  },
  required: ["document", "version"],
} as const;
/** Split an opaque supplied reference token without consulting or interpreting a formulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const i = reference.lastIndexOf(separator);
    H.domain(i > 0 && i + separator.length < reference.length);
    return {
      document: reference.slice(0, i),
      version: reference.slice(i + separator.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "formulary@v2", separator: "@" },
  output: { document: "formulary", version: "v2" },
} satisfies ToolExample<Input, Output>;
export const formularyReferenceVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/formulary-reference-version-token",
    title: "Formulary Reference Version Token Tool",
    description:
      "Split an opaque supplied reference token without consulting or interpreting a formulary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        document: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
      },
      required: ["document", "version"],
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
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "document", label: "Document", valueType: { type: "string" } },
        { id: "version", label: "Version", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = formularyReferenceVersionTokenTool.execute;
export default formularyReferenceVersionTokenTool;
