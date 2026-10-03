import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly index: number; readonly backwards: boolean };
export type Output = {
  readonly numerator: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer", minimum: 1, maximum: 1000000 },
    backwards: { type: "boolean" },
  },
  required: ["index", "backwards"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "integer" },
    denominator: { type: "integer" },
  },
  required: ["numerator", "denominator"],
} as const;
/** Compute factorial sequence ratio at index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { index, backwards } = input;
  const compute = (): Output => {
    integer(index, 1, 1000000);
    return {
      numerator: backwards ? 1 : index,
      denominator: backwards ? index : 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { index: 5, backwards: false },
  output: { numerator: 5, denominator: 1 },
} satisfies ToolExample<Input, Output>;
export const factorialSequenceRatioAtIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/factorial-sequence-ratio-at-index",
  title: "Factorial Sequence Ratio At Index Tool",
  description:
    "Compute factorial sequence ratio at index from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "backwards",
        label: "Backwards",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "numerator", label: "Numerator", valueType: { type: "integer" } },
      {
        id: "denominator",
        label: "Denominator",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = factorialSequenceRatioAtIndexTool.execute;
export default factorialSequenceRatioAtIndexTool;
