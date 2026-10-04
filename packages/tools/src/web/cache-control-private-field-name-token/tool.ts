import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = { readonly fields: readonly string[] };
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
    fields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["fields"],
} as const;
/** Compute cache control private field name token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const m = /^private="([^"]*)"(?![\s\S])/i.exec(value);
    domain(m);
    const fields = m[1].split(",").map((x) => x.trim().toLowerCase());
    domain(
      fields.every((x) => /^[!#$%&\x27*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(x)),
    );
    return { fields };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 'private="Set-Cookie, X-Test"' },
  output: { fields: ["set-cookie", "x-test"] },
} satisfies ToolExample<Input, Output>;
export const cacheControlPrivateFieldNameTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/cache-control-private-field-name-token",
  title: "Cache Control Private Field Name Token Tool",
  description:
    "Compute cache control private field name token from explicit bounded inputs.",
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
      {
        id: "fields",
        label: "Fields",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = cacheControlPrivateFieldNameTokenTool.execute;
export default cacheControlPrivateFieldNameTokenTool;
