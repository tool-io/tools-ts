import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alphabet: readonly string[];
  readonly targetCounts: readonly number[];
  readonly prefix: readonly string[];
};
export type Output = {
  readonly deficits: readonly number[];
  readonly unknownTokens: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alphabet: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    prefix: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["alphabet", "targetCounts", "prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deficits: { type: "array", maxItems: 256, items: { type: "integer" } },
    unknownTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["deficits", "unknownTokens"],
} as const;
/** Compare a supplied prefix’s exact symbol counts with target multiplicities, preserving overfill and unknown tokens. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alphabet, targetCounts, prefix } = request;
  const compute = (): Output => {
    H.sameLength(alphabet, targetCounts);
    H.domain(
      new Set(alphabet).size === alphabet.length &&
        targetCounts.every((x) => x >= 0),
    );
    return {
      deficits: alphabet.map(
        (x, i) => targetCounts[i] - prefix.filter((y) => y === x).length,
      ),
      unknownTokens: prefix.filter((x) => !alphabet.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alphabet: ["A", "B"],
    targetCounts: [3, 2],
    prefix: ["A", "A", "B"],
  },
  output: { deficits: [1, 1], unknownTokens: [] },
} satisfies ToolExample<Input, Output>;
export const wordPrefixSymbolDeficitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/word-prefix-symbol-deficit",
    title: "Word Prefix Symbol Deficit Tool",
    description:
      "Compare a supplied prefix’s exact symbol counts with target multiplicities, preserving overfill and unknown tokens.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alphabet: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targetCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        prefix: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["alphabet", "targetCounts", "prefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deficits: { type: "array", maxItems: 256, items: { type: "integer" } },
        unknownTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["deficits", "unknownTokens"],
    },
    ports: {
      inputs: [
        {
          id: "alphabet",
          label: "Alphabet",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targetCounts",
          label: "Target Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "deficits",
          label: "Deficits",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "unknownTokens",
          label: "Unknown Tokens",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = wordPrefixSymbolDeficitTool.execute;
export default wordPrefixSymbolDeficitTool;
