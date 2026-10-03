import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSequence: number;
  readonly nextSequence: number;
  readonly suppliedExpectedIncrement: number;
};
export type Output = {
  readonly increment: number;
  readonly skippedRelativeToIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSequence: { type: "integer", minimum: 0 },
    nextSequence: { type: "integer", minimum: 0 },
    suppliedExpectedIncrement: { type: "integer", minimum: 1 },
  },
  required: ["previousSequence", "nextSequence", "suppliedExpectedIncrement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increment: { type: "integer" },
    skippedRelativeToIncrement: { type: "integer" },
  },
  required: ["increment", "skippedRelativeToIncrement"],
} as const;
/** Compare supplied sequence metadata without inferring an authority’s submission numbering rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSequence, nextSequence, suppliedExpectedIncrement } = request;
  const compute = (): Output => {
    H.integer(previousSequence, 0);
    H.integer(nextSequence, 0);
    H.integer(suppliedExpectedIncrement, 1);
    return {
      increment: nextSequence - previousSequence,
      skippedRelativeToIncrement:
        nextSequence - previousSequence - suppliedExpectedIncrement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousSequence: 10,
    nextSequence: 13,
    suppliedExpectedIncrement: 1,
  },
  output: { increment: 3, skippedRelativeToIncrement: 2 },
} satisfies ToolExample<Input, Output>;
export const submissionSequenceNumberGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/submission-sequence-number-gap",
    title: "Submission Sequence Number Gap Tool",
    description:
      "Compare supplied sequence metadata without inferring an authority’s submission numbering rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSequence: { type: "integer", minimum: 0 },
        nextSequence: { type: "integer", minimum: 0 },
        suppliedExpectedIncrement: { type: "integer", minimum: 1 },
      },
      required: [
        "previousSequence",
        "nextSequence",
        "suppliedExpectedIncrement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "integer" },
        skippedRelativeToIncrement: { type: "integer" },
      },
      required: ["increment", "skippedRelativeToIncrement"],
    },
    ports: {
      inputs: [
        {
          id: "previousSequence",
          label: "Previous Sequence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextSequence",
          label: "Next Sequence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedExpectedIncrement",
          label: "Supplied Expected Increment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "integer" } },
        {
          id: "skippedRelativeToIncrement",
          label: "Skipped Relative To Increment",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = submissionSequenceNumberGapTool.execute;
export default submissionSequenceNumberGapTool;
