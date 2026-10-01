import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly norm: number;
  readonly zeroValue: number;
};
export type Output = { readonly defined: boolean; readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    norm: { type: "number" },
    zeroValue: { type: "number" },
  },
  required: ["value", "norm", "zeroValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, normalized: { type: "number" } },
  required: ["defined", "normalized"],
} as const;
/** Compute scalar norm reference zero policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, norm, zeroValue } = input;
  const compute = (): Output => {
    domain(norm >= 0);
    return {
      defined: norm > 0,
      normalized: norm === 0 ? zeroValue : value / norm,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 0, norm: 0, zeroValue: 0 },
  output: { defined: false, normalized: 0 },
} satisfies ToolExample<Input, Output>;
export const scalarNormReferenceZeroPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/scalar-norm-reference-zero-policy",
  title: "Scalar Norm Reference Zero Policy Tool",
  description:
    "Compute scalar norm reference zero policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "norm",
        label: "Norm",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "zeroValue",
        label: "Zero Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      { id: "normalized", label: "Normalized", valueType: { type: "number" } },
    ],
  },
});
export const run = scalarNormReferenceZeroPolicyTool.execute;
export default scalarNormReferenceZeroPolicyTool;
