import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly source: string;
  readonly namespace: string;
};
export type Output = { readonly qualifiedKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    namespace: { type: "string", maxLength: 8192 },
  },
  required: ["term", "source", "namespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedKey: { type: "string", maxLength: 8192 } },
  required: ["qualifiedKey"],
} as const;
/** Preserve supplied kin-term provenance without assigning a universal kinship interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, source, namespace } = request;
  const compute = (): Output => {
    return { qualifiedKey: JSON.stringify([source, namespace, term]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { term: "term-A", source: "interview-7", namespace: "speaker-2" },
  output: { qualifiedKey: '["interview-7","speaker-2","term-A"]' },
} satisfies ToolExample<Input, Output>;
export const kinTermSourceNamespaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/kin-term-source-namespace",
    title: "Kin Term Source Namespace Tool",
    description:
      "Preserve supplied kin-term provenance without assigning a universal kinship interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        namespace: { type: "string", maxLength: 8192 },
      },
      required: ["term", "source", "namespace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifiedKey: { type: "string", maxLength: 8192 } },
      required: ["qualifiedKey"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
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
          id: "namespace",
          label: "Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "qualifiedKey",
          label: "Qualified Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = kinTermSourceNamespaceTool.execute;
export default kinTermSourceNamespaceTool;
