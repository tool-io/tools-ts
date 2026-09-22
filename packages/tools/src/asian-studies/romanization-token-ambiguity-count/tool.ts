import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTokens: readonly string[];
  readonly romanizedTokens: readonly string[];
};
export type Output = {
  readonly ambiguousRomanizations: number;
  readonly collidingSourceTokens: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    romanizedTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["sourceTokens", "romanizedTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ambiguousRomanizations: { type: "integer" },
    collidingSourceTokens: { type: "integer" },
  },
  required: ["ambiguousRomanizations", "collidingSourceTokens"],
} as const;
/** Count collisions in a supplied romanization mapping, without generating linguistic equivalences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTokens, romanizedTokens } = request;
  const compute = (): Output => {
    H.sameLength(sourceTokens, romanizedTokens);
    return (() => {
      const groups = new Map<string, Set<string>>();
      sourceTokens.forEach((x, i) => {
        const s = groups.get(romanizedTokens[i]) ?? new Set<string>();
        s.add(x);
        groups.set(romanizedTokens[i], s);
      });
      const ambiguous = [...groups.values()].filter((x) => x.size > 1);
      return {
        ambiguousRomanizations: ambiguous.length,
        collidingSourceTokens: ambiguous.reduce((s, x) => s + x.size, 0),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceTokens: ["甲", "乙", "丙"], romanizedTokens: ["a", "a", "b"] },
  output: { ambiguousRomanizations: 1, collidingSourceTokens: 2 },
} satisfies ToolExample<Input, Output>;
export const romanizationTokenAmbiguityCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/romanization-token-ambiguity-count",
    title: "Romanization Token Ambiguity Count Tool",
    description:
      "Count collisions in a supplied romanization mapping, without generating linguistic equivalences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        romanizedTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["sourceTokens", "romanizedTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ambiguousRomanizations: { type: "integer" },
        collidingSourceTokens: { type: "integer" },
      },
      required: ["ambiguousRomanizations", "collidingSourceTokens"],
    },
    ports: {
      inputs: [
        {
          id: "sourceTokens",
          label: "Source Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "romanizedTokens",
          label: "Romanized Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "ambiguousRomanizations",
          label: "Ambiguous Romanizations",
          valueType: { type: "integer" },
        },
        {
          id: "collidingSourceTokens",
          label: "Colliding Source Tokens",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = romanizationTokenAmbiguityCountTool.execute;
export default romanizationTokenAmbiguityCountTool;
