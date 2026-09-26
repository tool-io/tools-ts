import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number };
export type Output = {
  readonly high: number;
  readonly low: number;
  readonly escapes: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer", minimum: 65536 } },
  required: ["point"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "integer" },
    low: { type: "integer" },
    escapes: { type: "string", maxLength: 8192 },
  },
  required: ["high", "low", "escapes"],
} as const;
/** Compute utf16 non bmp escape pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point } = input;
  const compute = (): Output => {
    integer(point, 65536, 0x10ffff);
    const u = point - 65536,
      high = 0xd800 + (u >> 10),
      low = 0xdc00 + (u & 1023);
    return {
      high,
      low,
      escapes:
        "\\u" +
        high.toString(16).padStart(4, "0") +
        "\\u" +
        low.toString(16).padStart(4, "0"),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 128512 },
  output: { high: 55357, low: 56832, escapes: "\\ud83d\\ude00" },
} satisfies ToolExample<Input, Output>;
export const utf16NonBmpEscapePairTool = defineSchemaCalculation<Input, Output>(
  {
    id: "encode/utf16-non-bmp-escape-pair",
    title: "Utf16 Non Bmp Escape Pair Tool",
    description:
      "Compute utf16 non bmp escape pair from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "point",
          label: "Point",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "high", label: "High", valueType: { type: "integer" } },
        { id: "low", label: "Low", valueType: { type: "integer" } },
        { id: "escapes", label: "Escapes", valueType: { type: "string" } },
      ],
    },
  },
);
export const run = utf16NonBmpEscapePairTool.execute;
export default utf16NonBmpEscapePairTool;
