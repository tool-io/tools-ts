import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly insertion: number;
  readonly deletion: number;
  readonly substitutionForward: number;
  readonly substitutionBackward: number;
};
export type Output = {
  readonly symmetric: boolean;
  readonly insertionDeletionGap: number;
  readonly substitutionGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insertion: { type: "number" },
    deletion: { type: "number" },
    substitutionForward: { type: "number" },
    substitutionBackward: { type: "number" },
  },
  required: [
    "insertion",
    "deletion",
    "substitutionForward",
    "substitutionBackward",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symmetric: { type: "boolean" },
    insertionDeletionGap: { type: "number" },
    substitutionGap: { type: "number" },
  },
  required: ["symmetric", "insertionDeletionGap", "substitutionGap"],
} as const;
/** Calculate edit distance cost symmetry pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { insertion, deletion, substitutionForward, substitutionBackward } =
    request;
  const compute = (): Output => {
    H.domain(
      [insertion, deletion, substitutionForward, substitutionBackward].every(
        (x) => x >= 0,
      ),
    );
    return {
      symmetric:
        insertion === deletion && substitutionForward === substitutionBackward,
      insertionDeletionGap: insertion - deletion,
      substitutionGap: substitutionForward - substitutionBackward,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    insertion: 1,
    deletion: 2,
    substitutionForward: 3,
    substitutionBackward: 3,
  },
  output: { symmetric: false, insertionDeletionGap: -1, substitutionGap: 0 },
} satisfies ToolExample<Input, Output>;
export const editDistanceCostSymmetryPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/edit-distance-cost-symmetry-pair",
    title: "Edit Distance Cost Symmetry Pair Tool",
    description:
      "Calculate edit distance cost symmetry pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insertion: { type: "number" },
        deletion: { type: "number" },
        substitutionForward: { type: "number" },
        substitutionBackward: { type: "number" },
      },
      required: [
        "insertion",
        "deletion",
        "substitutionForward",
        "substitutionBackward",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symmetric: { type: "boolean" },
        insertionDeletionGap: { type: "number" },
        substitutionGap: { type: "number" },
      },
      required: ["symmetric", "insertionDeletionGap", "substitutionGap"],
    },
    ports: {
      inputs: [
        {
          id: "insertion",
          label: "Insertion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deletion",
          label: "Deletion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "substitutionForward",
          label: "Substitution Forward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "substitutionBackward",
          label: "Substitution Backward",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "symmetric", label: "Symmetric", valueType: { type: "boolean" } },
        {
          id: "insertionDeletionGap",
          label: "Insertion Deletion Gap",
          valueType: { type: "number" },
        },
        {
          id: "substitutionGap",
          label: "Substitution Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = editDistanceCostSymmetryPairTool.execute;
export default editDistanceCostSymmetryPairTool;
