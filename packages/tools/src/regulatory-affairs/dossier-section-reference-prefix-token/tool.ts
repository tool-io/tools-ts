import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: string;
  readonly allowedPrefixes: readonly string[];
};
export type Output = { readonly prefix: string; readonly remainder: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    allowedPrefixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["reference", "allowedPrefixes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    remainder: { type: "string", maxLength: 8192 },
  },
  required: ["prefix", "remainder"],
} as const;
/** Split a section reference using the longest explicitly permitted prefix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, allowedPrefixes } = request;
  const compute = (): Output => {
    const matches = allowedPrefixes.filter(
      (x) => x.length > 0 && reference.startsWith(x),
    );
    H.domain(matches.length > 0, "reference");
    matches.sort((a, b) => b.length - a.length);
    const prefix = matches[0];
    return { prefix, remainder: reference.slice(prefix.length) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "3.2.S.4", allowedPrefixes: ["3.", "3.2."] },
  output: { prefix: "3.2.", remainder: "S.4" },
} satisfies ToolExample<Input, Output>;
export const dossierSectionReferencePrefixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/dossier-section-reference-prefix-token",
    title: "Dossier Section Reference Prefix Token Tool",
    description:
      "Split a section reference using the longest explicitly permitted prefix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        allowedPrefixes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["reference", "allowedPrefixes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        remainder: { type: "string", maxLength: 8192 },
      },
      required: ["prefix", "remainder"],
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
          id: "allowedPrefixes",
          label: "Allowed Prefixes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        { id: "remainder", label: "Remainder", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = dossierSectionReferencePrefixTokenTool.execute;
export default dossierSectionReferencePrefixTokenTool;
