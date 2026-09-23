import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly suppliedThreshold: number;
  readonly higherIsMatch: boolean;
  readonly equalityMatches: boolean;
};
export type Output = {
  readonly margin: number;
  readonly matchesUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    suppliedThreshold: { type: "number" },
    higherIsMatch: { type: "boolean" },
    equalityMatches: { type: "boolean" },
  },
  required: ["score", "suppliedThreshold", "higherIsMatch", "equalityMatches"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    matchesUnderRule: { type: "boolean" },
  },
  required: ["margin", "matchesUnderRule"],
} as const;
/** Evaluate an explicit supplied score threshold convention without authentication or accuracy claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, suppliedThreshold, higherIsMatch, equalityMatches } = request;
  const compute = (): Output => {
    return {
      margin: (score - suppliedThreshold) * (higherIsMatch ? 1 : -1),
      matchesUnderRule:
        (score - suppliedThreshold) * (higherIsMatch ? 1 : -1) > 0 ||
        (equalityMatches && score === suppliedThreshold),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    score: 0.8,
    suppliedThreshold: 0.7,
    higherIsMatch: true,
    equalityMatches: true,
  },
  output: { margin: 0.10000000000000009, matchesUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const matchScoreMarginToThresholdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/match-score-margin-to-threshold",
    title: "Match Score Margin To Threshold Tool",
    description:
      "Evaluate an explicit supplied score threshold convention without authentication or accuracy claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        suppliedThreshold: { type: "number" },
        higherIsMatch: { type: "boolean" },
        equalityMatches: { type: "boolean" },
      },
      required: [
        "score",
        "suppliedThreshold",
        "higherIsMatch",
        "equalityMatches",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        matchesUnderRule: { type: "boolean" },
      },
      required: ["margin", "matchesUnderRule"],
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
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherIsMatch",
          label: "Higher Is Match",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "equalityMatches",
          label: "Equality Matches",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "matchesUnderRule",
          label: "Matches Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = matchScoreMarginToThresholdTool.execute;
export default matchScoreMarginToThresholdTool;
