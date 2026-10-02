import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly kind: string; readonly name: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    name: { type: "string", maxLength: 8192 },
  },
  required: ["kind", "name"],
} as const;
/** Compute yaml anchor alias prefix token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^([&*])([^\s\[\]{},]+)(?![\s\S])/.exec(token);
    domain(m);
    return { kind: m[1] === "&" ? "anchor" : "alias", name: m[2] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "&defaults" },
  output: { kind: "anchor", name: "defaults" },
} satisfies ToolExample<Input, Output>;
export const yamlAnchorAliasPrefixTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/yaml-anchor-alias-prefix-token",
  title: "Yaml Anchor Alias Prefix Token Tool",
  description:
    "Compute yaml anchor alias prefix token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "name", label: "Name", valueType: { type: "string" } },
    ],
  },
});
export const run = yamlAnchorAliasPrefixTokenTool.execute;
export default yamlAnchorAliasPrefixTokenTool;
