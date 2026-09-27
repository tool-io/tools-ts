import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responses: readonly string[];
  readonly missingTokens: readonly string[];
  readonly trimBeforeComparison: boolean;
};
export type Output = {
  readonly missingCount: number;
  readonly observedCount: number;
  readonly missingPositions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trimBeforeComparison: { type: "boolean" },
  },
  required: ["responses", "missingTokens", "trimBeforeComparison"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingCount: { type: "integer" },
    observedCount: { type: "integer" },
    missingPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["missingCount", "observedCount", "missingPositions"],
} as const;
/** Audit caller-defined missing-response tokens without inferring gender or recoding self-description. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responses, missingTokens, trimBeforeComparison } = request;
  const compute = (): Output => {
    const missingPositions = responses.flatMap((x, i) =>
      missingTokens.includes(trimBeforeComparison ? x.trim() : x) ? [i] : [],
    );
    return {
      missingCount: missingPositions.length,
      observedCount: responses.length - missingPositions.length,
      missingPositions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responses: ["person-defined", " ", "skip"],
    missingTokens: ["", "skip"],
    trimBeforeComparison: true,
  },
  output: { missingCount: 2, observedCount: 1, missingPositions: [1, 2] },
} satisfies ToolExample<Input, Output>;
export const surveySelfDescriptionMissingnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/survey-self-description-missingness",
    title: "Survey Self Description Missingness Tool",
    description:
      "Audit caller-defined missing-response tokens without inferring gender or recoding self-description.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        trimBeforeComparison: { type: "boolean" },
      },
      required: ["responses", "missingTokens", "trimBeforeComparison"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingCount: { type: "integer" },
        observedCount: { type: "integer" },
        missingPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["missingCount", "observedCount", "missingPositions"],
    },
    ports: {
      inputs: [
        {
          id: "responses",
          label: "Responses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingTokens",
          label: "Missing Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "trimBeforeComparison",
          label: "Trim Before Comparison",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        {
          id: "observedCount",
          label: "Observed Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingPositions",
          label: "Missing Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = surveySelfDescriptionMissingnessTool.execute;
export default surveySelfDescriptionMissingnessTool;
