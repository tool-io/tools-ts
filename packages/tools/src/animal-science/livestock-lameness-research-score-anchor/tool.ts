import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
  readonly reverse: boolean;
};
export type Output = { readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
    reverse: { type: "boolean" },
  },
  required: ["score", "scaleMinimum", "scaleMaximum", "reverse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "number" } },
  required: ["normalized"],
} as const;
/** Rescale a supplied research score using explicit anchors; no diagnosis, clinical threshold or severity interpretation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, scaleMinimum, scaleMaximum, reverse } = request;
  const compute = (): Output => {
    H.domain(
      scaleMaximum > scaleMinimum &&
        score >= scaleMinimum &&
        score <= scaleMaximum,
    );
    return {
      normalized: reverse
        ? (scaleMaximum - score) / (scaleMaximum - scaleMinimum)
        : (score - scaleMinimum) / (scaleMaximum - scaleMinimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 3, scaleMinimum: 1, scaleMaximum: 5, reverse: false },
  output: { normalized: 0.5 },
} satisfies ToolExample<Input, Output>;
export const livestockLamenessResearchScoreAnchorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "animal-science/livestock-lameness-research-score-anchor",
      title: "Livestock Lameness Research Score Anchor Tool",
      description:
        "Rescale a supplied research score using explicit anchors; no diagnosis, clinical threshold or severity interpretation is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          scaleMinimum: { type: "number" },
          scaleMaximum: { type: "number" },
          reverse: { type: "boolean" },
        },
        required: ["score", "scaleMinimum", "scaleMaximum", "reverse"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalized: { type: "number" } },
        required: ["normalized"],
      },
      ports: {
        inputs: [
          {
            id: "score",
            label: "Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scaleMinimum",
            label: "Scale Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scaleMaximum",
            label: "Scale Maximum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reverse",
            label: "Reverse",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = livestockLamenessResearchScoreAnchorTool.execute;
export default livestockLamenessResearchScoreAnchorTool;
