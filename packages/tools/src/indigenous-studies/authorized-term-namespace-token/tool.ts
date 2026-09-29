import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly namespace: string;
  readonly delimiter: string;
};
export type Output = { readonly qualifiedTerm: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    namespace: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
  },
  required: ["term", "namespace", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedTerm: { type: "string", maxLength: 8192 } },
  required: ["qualifiedTerm"],
} as const;
/** Qualify an explicitly authorized supplied term without providing or inferring restricted vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, namespace, delimiter } = request;
  const compute = (): Output => {
    H.domain(term.length > 0 && namespace.length > 0 && delimiter.length > 0);
    return { qualifiedTerm: namespace + delimiter + term };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { term: "termA", namespace: "authorized-public", delimiter: ":" },
  output: { qualifiedTerm: "authorized-public:termA" },
} satisfies ToolExample<Input, Output>;
export const authorizedTermNamespaceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/authorized-term-namespace-token",
    title: "Authorized Term Namespace Token Tool",
    description:
      "Qualify an explicitly authorized supplied term without providing or inferring restricted vocabulary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        namespace: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
      },
      required: ["term", "namespace", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifiedTerm: { type: "string", maxLength: 8192 } },
      required: ["qualifiedTerm"],
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
          id: "namespace",
          label: "Namespace",
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
          id: "qualifiedTerm",
          label: "Qualified Term",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedTermNamespaceTokenTool.execute;
export default authorizedTermNamespaceTokenTool;
