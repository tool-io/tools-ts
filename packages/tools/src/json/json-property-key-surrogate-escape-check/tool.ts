import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  parseJson,
  text,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = {
  readonly validUnicode: boolean;
  readonly decoded: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validUnicode: { type: "boolean" },
    decoded: { type: "string", maxLength: 8192 },
  },
  required: ["validUnicode", "decoded"],
} as const;
/** Compute json property key surrogate escape check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    const value = text(parseJson(lexeme));
    let validUnicode = true;
    for (let i = 0; i < value.length; i++) {
      const c = value.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        const d = value.charCodeAt(++i);
        if (!(d >= 0xdc00 && d <= 0xdfff)) validUnicode = false;
      } else if (c >= 0xdc00 && c <= 0xdfff) validUnicode = false;
    }
    return { validUnicode, decoded: value };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: '"\\ud800"' },
  output: { validUnicode: false, decoded: "\ud800" },
} satisfies ToolExample<Input, Output>;
export const jsonPropertyKeySurrogateEscapeCheckTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-property-key-surrogate-escape-check",
  title: "JSON Property Key Surrogate Escape Check Tool",
  description:
    "Compute json property key surrogate escape check from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lexeme",
        label: "Lexeme",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "validUnicode",
        label: "Valid Unicode",
        valueType: { type: "boolean" },
      },
      { id: "decoded", label: "Decoded", valueType: { type: "string" } },
    ],
  },
});
export const run = jsonPropertyKeySurrogateEscapeCheckTool.execute;
export default jsonPropertyKeySurrogateEscapeCheckTool;
