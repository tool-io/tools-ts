import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string; readonly multiple: string };
export type Output = { readonly lower: string; readonly upper: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    multiple: { type: "string", maxLength: 8192 },
  },
  required: ["value", "multiple"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "string", maxLength: 8192 },
    upper: { type: "string", maxLength: 8192 },
  },
  required: ["lower", "upper"],
} as const;
/** Compute integer multiple nearest lower upper from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, multiple } = input;
  const compute = (): Output => {
    const a = decimal(value),
      b = decimal(multiple);
    domain(b > 0n);
    const r = ((a % b) + b) % b,
      lower = a - r;
    return {
      lower: lower.toString(),
      upper: (r === 0n ? lower : lower + b).toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "-7", multiple: "3" },
  output: { lower: "-9", upper: "-6" },
} satisfies ToolExample<Input, Output>;
export const integerMultipleNearestLowerUpperTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/integer-multiple-nearest-lower-upper",
  title: "Integer Multiple Nearest Lower Upper Tool",
  description:
    "Compute integer multiple nearest lower upper from explicit bounded inputs.",
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
      {
        id: "multiple",
        label: "Multiple",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "lower", label: "Lower", valueType: { type: "string" } },
      { id: "upper", label: "Upper", valueType: { type: "string" } },
    ],
  },
});
export const run = integerMultipleNearestLowerUpperTool.execute;
export default integerMultipleNearestLowerUpperTool;
