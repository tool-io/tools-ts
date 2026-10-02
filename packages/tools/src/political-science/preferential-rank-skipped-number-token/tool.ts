import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ranks: readonly number[] };
export type Output = {
  readonly skipped: readonly number[];
  readonly duplicates: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ranks: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["ranks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    skipped: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicates: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["skipped", "duplicates"],
} as const;
/** Report omitted and duplicated positive preference numbers, without deciding ballot validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ranks } = request;
  const compute = (): Output => {
    H.domain(ranks.length > 0 && ranks.every((x) => x >= 1 && x <= 256));
    const unique = new Set(ranks),
      maximum = Math.max(...ranks);
    return {
      skipped: Array.from({ length: maximum }, (_, i) => i + 1).filter(
        (x) => !unique.has(x),
      ),
      duplicates: [...unique].filter(
        (x) => ranks.filter((v) => v === x).length > 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ranks: [1, 3, 3] },
  output: { skipped: [2], duplicates: [3] },
} satisfies ToolExample<Input, Output>;
export const preferentialRankSkippedNumberTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/preferential-rank-skipped-number-token",
    title: "Preferential Rank Skipped Number Token Tool",
    description:
      "Report omitted and duplicated positive preference numbers, without deciding ballot validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ranks: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["ranks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        skipped: { type: "array", maxItems: 256, items: { type: "integer" } },
        duplicates: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["skipped", "duplicates"],
    },
    ports: {
      inputs: [
        {
          id: "ranks",
          label: "Ranks",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "skipped",
          label: "Skipped",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicates",
          label: "Duplicates",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = preferentialRankSkippedNumberTokenTool.execute;
export default preferentialRankSkippedNumberTokenTool;
