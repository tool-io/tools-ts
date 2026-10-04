import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly relation: string };
export type Output = { readonly kind: string; readonly normalized: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relation: { type: "string", maxLength: 8192 } },
  required: ["relation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    normalized: { type: "string", maxLength: 8192 },
  },
  required: ["kind", "normalized"],
} as const;
/** Compute link relation extension uri label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { relation } = input;
  const compute = (): Output => {
    domain(relation.length > 0 && !/\s/.test(relation));
    if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(relation))
      return { kind: "extension-uri", normalized: relation };
    domain(/^[A-Za-z][A-Za-z0-9.-]*(?![\s\S])/.test(relation));
    return { kind: "registered-token", normalized: relation.toLowerCase() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { relation: "https://example.com/relation" },
  output: { kind: "extension-uri", normalized: "https://example.com/relation" },
} satisfies ToolExample<Input, Output>;
export const linkRelationExtensionUriLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/link-relation-extension-uri-label",
  title: "Link Relation Extension URI Label Tool",
  description:
    "Compute link relation extension uri label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "relation",
        label: "Relation",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "normalized", label: "Normalized", valueType: { type: "string" } },
    ],
  },
});
export const run = linkRelationExtensionUriLabelTool.execute;
export default linkRelationExtensionUriLabelTool;
