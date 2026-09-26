import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sequence: readonly number[] };
export type Output = {
  readonly positiveSequence: boolean;
  readonly inversions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequence: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["sequence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveSequence: { type: "boolean" },
    inversions: { type: "integer" },
  },
  required: ["positiveSequence", "inversions"],
} as const;
/** Classify phase-order orientation as permutation parity relative to the explicit [0,1,2] reference. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { sequence } = input;
  const compute = (): Output => {
    H.domain(
      sequence.length === 3 &&
        new Set(sequence).size === 3 &&
        sequence.every((x) => x >= 0 && x <= 2),
    );
    let inversions = 0;
    for (let i = 0; i < 3; i++)
      for (let j = i + 1; j < 3; j++)
        if (sequence[i] > sequence[j]) inversions++;
    return { positiveSequence: inversions % 2 === 0, inversions };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sequence: [0, 1, 2] },
  output: { positiveSequence: true, inversions: 0 },
} satisfies ToolExample<Input, Output>;
export const threePhasePhaseSequencePermutationParityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/three-phase-phase-sequence-permutation-parity",
      title: "Three Phase Phase Sequence Permutation Parity Tool",
      description:
        "Classify phase-order orientation as permutation parity relative to the explicit [0,1,2] reference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sequence: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["sequence"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positiveSequence: { type: "boolean" },
          inversions: { type: "integer" },
        },
        required: ["positiveSequence", "inversions"],
      },
      ports: {
        inputs: [
          {
            id: "sequence",
            label: "Sequence",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "positiveSequence",
            label: "Positive Sequence",
            valueType: { type: "boolean" },
          },
          {
            id: "inversions",
            label: "Inversions",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = threePhasePhaseSequencePermutationParityTool.execute;
export default threePhasePhaseSequencePermutationParityTool;
