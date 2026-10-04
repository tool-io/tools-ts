import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = { readonly kind: string; readonly identifier: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    identifier: { type: "string", maxLength: 8192 },
  },
  required: ["kind", "identifier"],
} as const;
/** Compute doi url prefix versus identifier tag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const prefix = /^https:\/\/(?:dx\.)?doi\.org\//i.exec(value),
      identifier = prefix ? value.slice(prefix[0].length) : value;
    domain(/^10\.\d{4,9}\/\S+(?![\s\S])/.test(identifier));
    return { kind: prefix ? "resolver-url" : "identifier", identifier };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "https://doi.org/10.1000/182" },
  output: { kind: "resolver-url", identifier: "10.1000/182" },
} satisfies ToolExample<Input, Output>;
export const doiUrlPrefixVersusIdentifierTagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/doi-url-prefix-versus-identifier-tag",
  title: "DOI URL Prefix Versus Identifier Tag Tool",
  description:
    "Compute doi url prefix versus identifier tag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "identifier", label: "Identifier", valueType: { type: "string" } },
    ],
  },
});
export const run = doiUrlPrefixVersusIdentifierTagTool.execute;
export default doiUrlPrefixVersusIdentifierTagTool;
