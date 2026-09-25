import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  codePoint,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly point: number; readonly digitCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer" }, digitCount: { type: "integer" } },
  required: ["point", "digitCount"],
} as const;
/** Compute unicode escape braced digit budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^\\u\{([0-9a-fA-F]{1,6})\}(?![\s\S])/.exec(token);
    domain(m);
    const point = parseInt(m[1], 16);
    codePoint(point);
    return { point, digitCount: m[1].length };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "\\u{1F600}" },
  output: { point: 128512, digitCount: 5 },
} satisfies ToolExample<Input, Output>;
export const unicodeEscapeBracedDigitBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/unicode-escape-braced-digit-budget",
  title: "Unicode Escape Braced Digit Budget Tool",
  description:
    "Compute unicode escape braced digit budget from explicit bounded inputs.",
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
      { id: "point", label: "Point", valueType: { type: "integer" } },
      {
        id: "digitCount",
        label: "Digit Count",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = unicodeEscapeBracedDigitBudgetTool.execute;
export default unicodeEscapeBracedDigitBudgetTool;
