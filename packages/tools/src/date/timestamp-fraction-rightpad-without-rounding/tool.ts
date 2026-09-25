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
export type Output = { readonly digits: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    width: { type: "integer", maximum: 64 },
  },
  required: ["digits", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
/** Compute timestamp fraction rightpad without rounding from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { digits, width } = input;
  const compute = (): Output => {
    domain(/^\d+(?![\s\S])/.test(digits));
    integer(width, digits.length, 64);
    return { digits: digits.padEnd(width, "0") };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { digits: "12", width: 6 },
  output: { digits: "120000" },
} satisfies ToolExample<Input, Output>;
export const timestampFractionRightpadWithoutRoundingTool =
  defineSchemaCalculation<Input, Output>({
    id: "date/timestamp-fraction-rightpad-without-rounding",
    title: "Timestamp Fraction Rightpad Without Rounding Tool",
    description:
      "Compute timestamp fraction rightpad without rounding from explicit bounded inputs.",
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
      ],
    },
  });
export const run = timestampFractionRightpadWithoutRoundingTool.execute;
export default timestampFractionRightpadWithoutRoundingTool;
