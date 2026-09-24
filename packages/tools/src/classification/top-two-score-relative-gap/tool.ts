import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scores: readonly number[] };
export type Output = {
  readonly top: number;
  readonly second: number;
  readonly relativeGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["scores"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    top: { type: "number" },
    second: { type: "number" },
    relativeGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["top", "second", "relativeGap", "defined"],
} as const;
/** Normalize the two greatest supplied scores’ separation by absolute top score, preserving signed-score inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scores } = request;
  const compute = (): Output => {
    H.domain(scores.length >= 2);
    const a = [...scores].sort((a, b) => b - a),
      top = a[0],
      second = a[1];
    return {
      top,
      second,
      relativeGap: top !== 0 ? (top - second) / Math.abs(top) : 0,
      defined: top !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scores: [2, 5, 3] },
  output: { top: 5, second: 3, relativeGap: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const topTwoScoreRelativeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/top-two-score-relative-gap",
    title: "Top Two Score Relative Gap Tool",
    description:
      "Normalize the two greatest supplied scores’ separation by absolute top score, preserving signed-score inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scores: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["scores"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        top: { type: "number" },
        second: { type: "number" },
        relativeGap: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["top", "second", "relativeGap", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "scores",
          label: "Scores",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "top", label: "Top", valueType: { type: "number" } },
        { id: "second", label: "Second", valueType: { type: "number" } },
        {
          id: "relativeGap",
          label: "Relative Gap",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = topTwoScoreRelativeGapTool.execute;
export default topTwoScoreRelativeGapTool;
