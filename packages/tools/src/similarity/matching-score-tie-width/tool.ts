import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scores: readonly number[];
  readonly reference: number;
  readonly tolerance: number;
};
export type Output = {
  readonly minimum: number;
  readonly maximum: number;
  readonly width: number;
  readonly tied: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: { type: "array", maxItems: 256, items: { type: "number" } },
    reference: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["scores", "reference", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "number" },
    maximum: { type: "number" },
    width: { type: "number" },
    tied: { type: "integer" },
  },
  required: ["minimum", "maximum", "width", "tied"],
} as const;
/** Measure the score range within a supplied absolute tolerance of one matching reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scores, reference, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return (() => {
      const tiedScores = scores.filter(
        (x) => Math.abs(x - reference) <= tolerance,
      );
      H.domain(tiedScores.length > 0, "scores");
      const minimum = Math.min(...tiedScores),
        maximum = Math.max(...tiedScores);
      return {
        minimum,
        maximum,
        width: maximum - minimum,
        tied: tiedScores.length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scores: [0.7, 0.75, 0.9], reference: 0.75, tolerance: 0.1 },
  output: { minimum: 0.7, maximum: 0.75, width: 0.050000000000000044, tied: 2 },
} satisfies ToolExample<Input, Output>;
export const matchingScoreTieWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/matching-score-tie-width",
    title: "Matching Score Tie Width Tool",
    description:
      "Measure the score range within a supplied absolute tolerance of one matching reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scores: { type: "array", maxItems: 256, items: { type: "number" } },
        reference: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["scores", "reference", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimum: { type: "number" },
        maximum: { type: "number" },
        width: { type: "number" },
        tied: { type: "integer" },
      },
      required: ["minimum", "maximum", "width", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "scores",
          label: "Scores",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reference",
          label: "Reference",
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
        { id: "minimum", label: "Minimum", valueType: { type: "number" } },
        { id: "maximum", label: "Maximum", valueType: { type: "number" } },
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "tied", label: "Tied", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = matchingScoreTieWidthTool.execute;
export default matchingScoreTieWidthTool;
