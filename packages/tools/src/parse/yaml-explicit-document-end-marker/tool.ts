import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly line: string };
export type Output = { readonly endMarker: boolean; readonly comment: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endMarker: { type: "boolean" },
    comment: { type: "string", maxLength: 8192 },
  },
  required: ["endMarker", "comment"],
} as const;
/** Compute yaml explicit document end marker from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const m = /^\.\.\.(?:[ \t]+(?:#(.*))?)?(?![\s\S])/.exec(line);
    return { endMarker: !!m, comment: m?.[1] ?? "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "... # end" },
  output: { endMarker: true, comment: " end" },
} satisfies ToolExample<Input, Output>;
export const yamlExplicitDocumentEndMarkerTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/yaml-explicit-document-end-marker",
  title: "Yaml Explicit Document End Marker Tool",
  description:
    "Compute yaml explicit document end marker from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "line",
        label: "Line",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "endMarker", label: "End Marker", valueType: { type: "boolean" } },
      { id: "comment", label: "Comment", valueType: { type: "string" } },
    ],
  },
});
export const run = yamlExplicitDocumentEndMarkerTool.execute;
export default yamlExplicitDocumentEndMarkerTool;
