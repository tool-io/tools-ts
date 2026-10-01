import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly name: string;
  readonly value: string;
  readonly quote: string;
};
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
    name: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
    quote: { type: "string", maxLength: 8192 },
  },
  required: ["name", "value", "quote"],
} as const;
/** Compute xml attribute equality delimiter from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m =
      /^([A-Za-z_:][A-Za-z0-9_.:-]*)[ \t]*=[ \t]*("([^"<]*)"|\x27([^\x27<]*)\x27)(?![\s\S])/.exec(
        token,
      );
    domain(m);
    return { name: m[1], value: m[3] ?? m[4], quote: m[2][0] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: 'id="abc"' },
  output: { name: "id", value: "abc", quote: '"' },
} satisfies ToolExample<Input, Output>;
export const xmlAttributeEqualityDelimiterTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/xml-attribute-equality-delimiter",
  title: "XML Attribute Equality Delimiter Tool",
  description:
    "Compute xml attribute equality delimiter from explicit bounded inputs.",
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
      { id: "name", label: "Name", valueType: { type: "string" } },
      { id: "value", label: "Value", valueType: { type: "string" } },
      { id: "quote", label: "Quote", valueType: { type: "string" } },
    ],
  },
});
export const run = xmlAttributeEqualityDelimiterTool.execute;
export default xmlAttributeEqualityDelimiterTool;
