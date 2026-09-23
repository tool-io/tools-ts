import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly missingToken: string;
  readonly inapplicableToken: string;
};
export type Output = {
  readonly observedIndices: readonly number[];
  readonly missingIndices: readonly number[];
  readonly inapplicableIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingToken: { type: "string", maxLength: 8192 },
    inapplicableToken: { type: "string", maxLength: 8192 },
  },
  required: ["tokens", "missingToken", "inapplicableToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    missingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    inapplicableIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["observedIndices", "missingIndices", "inapplicableIndices"],
} as const;
/** Keep explicitly supplied missing and inapplicable character tokens distinct. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, missingToken, inapplicableToken } = request;
  const compute = (): Output => {
    H.domain(missingToken !== inapplicableToken);
    return {
      observedIndices: tokens.flatMap((x, i) =>
        x !== missingToken && x !== inapplicableToken ? [i] : [],
      ),
      missingIndices: tokens.flatMap((x, i) => (x === missingToken ? [i] : [])),
      inapplicableIndices: tokens.flatMap((x, i) =>
        x === inapplicableToken ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: ["0", "?", "-", "1"],
    missingToken: "?",
    inapplicableToken: "-",
  },
  output: {
    observedIndices: [0, 3],
    missingIndices: [1],
    inapplicableIndices: [2],
  },
} satisfies ToolExample<Input, Output>;
export const biosystematicCharacterMissingInapplicableTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosystematics/biosystematic-character-missing-inapplicable-tag",
      title: "Biosystematic Character Missing Inapplicable Tag Tool",
      description:
        "Keep explicitly supplied missing and inapplicable character tokens distinct.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tokens: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missingToken: { type: "string", maxLength: 8192 },
          inapplicableToken: { type: "string", maxLength: 8192 },
        },
        required: ["tokens", "missingToken", "inapplicableToken"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          missingIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          inapplicableIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["observedIndices", "missingIndices", "inapplicableIndices"],
      },
      ports: {
        inputs: [
          {
            id: "tokens",
            label: "Tokens",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missingToken",
            label: "Missing Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "inapplicableToken",
            label: "Inapplicable Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "observedIndices",
            label: "Observed Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "missingIndices",
            label: "Missing Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "inapplicableIndices",
            label: "Inapplicable Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosystematicCharacterMissingInapplicableTagTool.execute;
export default biosystematicCharacterMissingInapplicableTagTool;
