import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grapheme: string;
  readonly sourceForms: readonly string[];
  readonly authorizedForms: readonly string[];
};
export type Output = { readonly found: boolean; readonly authorized: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grapheme: { type: "string", maxLength: 8192 },
    sourceForms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorizedForms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["grapheme", "sourceForms", "authorizedForms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    authorized: { type: "string", maxLength: 8192 },
  },
  required: ["found", "authorized"],
} as const;
/** Use only an explicitly authorized grapheme mapping, preserving unlisted forms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grapheme, sourceForms, authorizedForms } = request;
  const compute = (): Output => {
    H.sameLength(sourceForms, authorizedForms);
    H.domain(new Set(sourceForms).size === sourceForms.length);
    const i = sourceForms.indexOf(grapheme);
    return {
      found: i >= 0,
      authorized: i >= 0 ? authorizedForms[i] : grapheme,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grapheme: "a", sourceForms: ["a"], authorizedForms: ["A"] },
  output: { found: true, authorized: "A" },
} satisfies ToolExample<Input, Output>;
export const authorizedGraphemeCaseVariantTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/authorized-grapheme-case-variant-token",
    title: "Authorized Grapheme Case Variant Token Tool",
    description:
      "Use only an explicitly authorized grapheme mapping, preserving unlisted forms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grapheme: { type: "string", maxLength: 8192 },
        sourceForms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorizedForms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["grapheme", "sourceForms", "authorizedForms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        authorized: { type: "string", maxLength: 8192 },
      },
      required: ["found", "authorized"],
    },
    ports: {
      inputs: [
        {
          id: "grapheme",
          label: "Grapheme",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceForms",
          label: "Source Forms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorizedForms",
          label: "Authorized Forms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        {
          id: "authorized",
          label: "Authorized",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedGraphemeCaseVariantTokenTool.execute;
export default authorizedGraphemeCaseVariantTokenTool;
