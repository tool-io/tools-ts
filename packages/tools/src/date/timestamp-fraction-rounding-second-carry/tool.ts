import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly digits: string; readonly width: number };
export type Output = { readonly digits: string; readonly carry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 0 },
  },
  required: ["digits", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    carry: { type: "integer" },
  },
  required: ["digits", "carry"],
} as const;
/** Compute timestamp fraction rounding second carry from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { digits, width } = input;
  const compute = (): Output => {
    domain(/^\d{1,64}(?![\s\S])/.test(digits));
    integer(width, 0, Math.min(32, digits.length));
    const kept = digits.slice(0, width) || "0",
      round = Number(digits[width] ?? "0") >= 5,
      value = BigInt(kept) + (round ? 1n : 0n),
      limit = 10n ** BigInt(width);
    return {
      digits:
        width === 0 ? "" : (value % limit).toString().padStart(width, "0"),
      carry: value >= limit ? 1 : 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { digits: "9996", width: 3 },
  output: { digits: "000", carry: 1 },
} satisfies ToolExample<Input, Output>;
export const timestampFractionRoundingSecondCarryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/timestamp-fraction-rounding-second-carry",
  title: "Timestamp Fraction Rounding Second Carry Tool",
  description:
    "Compute timestamp fraction rounding second carry from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "digits",
        label: "Digits",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "digits", label: "Digits", valueType: { type: "string" } },
      { id: "carry", label: "Carry", valueType: { type: "integer" } },
    ],
  },
});
export const run = timestampFractionRoundingSecondCarryTool.execute;
export default timestampFractionRoundingSecondCarryTool;
