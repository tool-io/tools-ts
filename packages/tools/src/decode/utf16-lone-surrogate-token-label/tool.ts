import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly codeUnit: number };
export type Output = { readonly kind: string; readonly scalar: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { codeUnit: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["codeUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    scalar: { type: "boolean" },
  },
  required: ["kind", "scalar"],
} as const;
/** Compute utf16 lone surrogate token label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { codeUnit } = input;
  const compute = (): Output => {
    integer(codeUnit, 0, 65535);
    return {
      kind:
        codeUnit >= 0xd800 && codeUnit <= 0xdbff
          ? "high-surrogate"
          : codeUnit >= 0xdc00 && codeUnit <= 0xdfff
            ? "low-surrogate"
            : "non-surrogate",
      scalar: codeUnit < 0xd800 || codeUnit > 0xdfff,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { codeUnit: 55296 },
  output: { kind: "high-surrogate", scalar: false },
} satisfies ToolExample<Input, Output>;
export const utf16LoneSurrogateTokenLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/utf16-lone-surrogate-token-label",
  title: "Utf16 Lone Surrogate Token Label Tool",
  description:
    "Compute utf16 lone surrogate token label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "codeUnit",
        label: "Code Unit",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "scalar", label: "Scalar", valueType: { type: "boolean" } },
    ],
  },
});
export const run = utf16LoneSurrogateTokenLabelTool.execute;
export default utf16LoneSurrogateTokenLabelTool;
