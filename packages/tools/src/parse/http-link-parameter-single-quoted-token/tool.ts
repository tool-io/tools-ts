import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly parameter: string };
export type Output = { readonly name: string; readonly value: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "string", maxLength: 8192 } },
  required: ["parameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["name", "value"],
} as const;
/** Compute http link parameter single quoted token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { parameter } = input;
  const compute = (): Output => {
    const m =
      /^([!#$%&\x27*+.^_`|~0-9A-Za-z-]+)="((?:[^"\\\r\n]|\\[\x20-\x7e])*)"(?![\s\S])/.exec(
        parameter,
      );
    domain(m);
    return { name: m[1].toLowerCase(), value: m[2].replace(/\\(.)/g, "$1") };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parameter: 'title="report one"' },
  output: { name: "title", value: "report one" },
} satisfies ToolExample<Input, Output>;
export const httpLinkParameterSingleQuotedTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/http-link-parameter-single-quoted-token",
  title: "HTTP Link Parameter Single Quoted Token Tool",
  description:
    "Compute http link parameter single quoted token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "parameter",
        label: "Parameter",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "name", label: "Name", valueType: { type: "string" } },
      { id: "value", label: "Value", valueType: { type: "string" } },
    ],
  },
});
export const run = httpLinkParameterSingleQuotedTokenTool.execute;
export default httpLinkParameterSingleQuotedTokenTool;
