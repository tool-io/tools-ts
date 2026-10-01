import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly codeUnit: number; readonly character: string };
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
    codeUnit: { type: "integer" },
    character: { type: "string", maxLength: 8192 },
  },
  required: ["codeUnit", "character"],
} as const;
/** Compute properties unicode escape four digits from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(/^\\u[0-9a-fA-F]{4}(?![\s\S])/.test(token));
    const codeUnit = parseInt(token.slice(2), 16);
    domain(codeUnit < 0xd800 || codeUnit > 0xdfff);
    return { codeUnit, character: String.fromCharCode(codeUnit) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "\\u0041" },
  output: { codeUnit: 65, character: "A" },
} satisfies ToolExample<Input, Output>;
export const propertiesUnicodeEscapeFourDigitsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/properties-unicode-escape-four-digits",
  title: "Properties Unicode Escape Four Digits Tool",
  description:
    "Compute properties unicode escape four digits from explicit bounded inputs.",
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
      { id: "codeUnit", label: "Code Unit", valueType: { type: "integer" } },
      { id: "character", label: "Character", valueType: { type: "string" } },
    ],
  },
});
export const run = propertiesUnicodeEscapeFourDigitsTool.execute;
export default propertiesUnicodeEscapeFourDigitsTool;
