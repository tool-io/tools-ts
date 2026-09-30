import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suffix: string };
export type Output = { readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { suffix: { type: "string", maxLength: 8192 } },
  required: ["suffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kind: { type: "string", maxLength: 8192 } },
  required: ["kind"],
} as const;
/** Classify the lexical form of a supplied accession suffix without changing its spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suffix } = request;
  const compute = (): Output => {
    return {
      kind:
        suffix === ""
          ? "none"
          : /^\d+(?![\s\S])/.test(suffix)
            ? "numeric"
            : /^[A-Za-z]+(?![\s\S])/.test(suffix)
              ? "alphabetic"
              : "mixed",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suffix: "002" },
  output: { kind: "numeric" },
} satisfies ToolExample<Input, Output>;
export const accessionSuffixTypeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/accession-suffix-type-token",
    title: "Accession Suffix Type Token Tool",
    description:
      "Classify the lexical form of a supplied accession suffix without changing its spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { suffix: { type: "string", maxLength: 8192 } },
      required: ["suffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kind: { type: "string", maxLength: 8192 } },
      required: ["kind"],
    },
    ports: {
      inputs: [
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "kind", label: "Kind", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = accessionSuffixTypeTokenTool.execute;
export default accessionSuffixTypeTokenTool;
