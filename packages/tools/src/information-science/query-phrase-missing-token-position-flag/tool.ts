import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phraseTokens: readonly string[];
  readonly availableTokens: readonly string[];
};
export type Output = {
  readonly missingPositions: readonly number[];
  readonly missingTokens: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phraseTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    availableTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["phraseTokens", "availableTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    missingTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingPositions", "missingTokens"],
} as const;
/** Locate missing supplied phrase tokens by original position, preserving duplicates and exact case. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phraseTokens, availableTokens } = request;
  const compute = (): Output => {
    const missingPositions = phraseTokens.flatMap((x, i) =>
      availableTokens.includes(x) ? [] : [i],
    );
    return {
      missingPositions,
      missingTokens: missingPositions.map((i) => phraseTokens[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phraseTokens: ["a", "b", "a"], availableTokens: ["a"] },
  output: { missingPositions: [1], missingTokens: ["b"] },
} satisfies ToolExample<Input, Output>;
export const queryPhraseMissingTokenPositionFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/query-phrase-missing-token-position-flag",
      title: "Query Phrase Missing Token Position Flag Tool",
      description:
        "Locate missing supplied phrase tokens by original position, preserving duplicates and exact case.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          phraseTokens: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          availableTokens: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["phraseTokens", "availableTokens"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingPositions: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          missingTokens: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["missingPositions", "missingTokens"],
      },
      ports: {
        inputs: [
          {
            id: "phraseTokens",
            label: "Phrase Tokens",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "availableTokens",
            label: "Available Tokens",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "missingPositions",
            label: "Missing Positions",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "missingTokens",
            label: "Missing Tokens",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = queryPhraseMissingTokenPositionFlagTool.execute;
export default queryPhraseMissingTokenPositionFlagTool;
