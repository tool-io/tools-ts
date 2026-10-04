import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly aa: number;
  readonly bb: number;
  readonly ab: number;
  readonly tolerance: number;
};
export type Output = {
  readonly determinant: number;
  readonly nonnegativeWithinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aa: { type: "number", minimum: 0 },
    bb: { type: "number", minimum: 0 },
    ab: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["aa", "bb", "ab", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    determinant: { type: "number" },
    nonnegativeWithinTolerance: { type: "boolean" },
  },
  required: ["determinant", "nonnegativeWithinTolerance"],
} as const;
/** Calculate vector gram determinant roundoff check from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { aa, bb, ab, tolerance } = input;
  const compute = (): Output => {
    H.domain(aa >= 0 && bb >= 0 && tolerance >= 0);
    const determinant = aa * bb - ab * ab;
    return {
      determinant,
      nonnegativeWithinTolerance: determinant >= -tolerance,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { aa: 4, bb: 9, ab: 3, tolerance: 0 },
  output: { determinant: 27, nonnegativeWithinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const vectorGramDeterminantRoundoffCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-gram-determinant-roundoff-check",
    title: "Vector Gram Determinant Roundoff Check Tool",
    description:
      "Calculate vector gram determinant roundoff check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aa: { type: "number", minimum: 0 },
        bb: { type: "number", minimum: 0 },
        ab: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["aa", "bb", "ab", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        determinant: { type: "number" },
        nonnegativeWithinTolerance: { type: "boolean" },
      },
      required: ["determinant", "nonnegativeWithinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "aa",
          label: "Aa",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bb",
          label: "Bb",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ab",
          label: "Ab",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "determinant",
          label: "Determinant",
          valueType: { type: "number" },
        },
        {
          id: "nonnegativeWithinTolerance",
          label: "Nonnegative Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorGramDeterminantRoundoffCheckTool.execute;
export default vectorGramDeterminantRoundoffCheckTool;
