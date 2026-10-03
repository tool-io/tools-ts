import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly index: number };
export type Output = {
  readonly current: number;
  readonly next: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer", minimum: 0, maximum: 1000000 } },
  required: ["index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    next: { type: "number" },
    gap: { type: "integer" },
  },
  required: ["current", "next", "gap"],
} as const;
/** Compute triangular sequence successive gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { index } = input;
  const compute = (): Output => {
    integer(index, 0, 1000000);
    return {
      current: (index * (index + 1)) / 2,
      next: ((index + 1) * (index + 2)) / 2,
      gap: index + 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { index: 4 },
  output: { current: 10, next: 15, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const triangularSequenceSuccessiveGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/triangular-sequence-successive-gap",
  title: "Triangular Sequence Successive Gap Tool",
  description:
    "Compute triangular sequence successive gap from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "current", label: "Current", valueType: { type: "number" } },
      { id: "next", label: "Next", valueType: { type: "number" } },
      { id: "gap", label: "Gap", valueType: { type: "integer" } },
    ],
  },
});
export const run = triangularSequenceSuccessiveGapTool.execute;
export default triangularSequenceSuccessiveGapTool;
