import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  rankCorrelationInputPorts,
  rankCorrelationInputSchema,
  validateRankCorrelationInput,
  type RankCorrelationInput,
} from "../rank-correlation-input.js";

export type KendallTauInput = RankCorrelationInput;
export type KendallTauOutput = {
  readonly concordant: number;
  readonly discordant: number;
  readonly tauB: number;
  readonly tiedInBoth: number;
  readonly tiedInFirstOnly: number;
  readonly tiedInSecondOnly: number;
};
export const kendallTauInputSchema = rankCorrelationInputSchema;
export const kendallTauOutputSchema = {
  additionalProperties: false,
  properties: {
    concordant: { minimum: 0, type: "integer" },
    discordant: { minimum: 0, type: "integer" },
    tauB: { maximum: 1, minimum: -1, type: "number" },
    tiedInBoth: { minimum: 0, type: "integer" },
    tiedInFirstOnly: { minimum: 0, type: "integer" },
    tiedInSecondOnly: { minimum: 0, type: "integer" },
  },
  required: [
    "concordant",
    "discordant",
    "tauB",
    "tiedInBoth",
    "tiedInFirstOnly",
    "tiedInSecondOnly",
  ],
  type: "object",
} as const;

/** Kendall tau-b with separate one-variable and joint ties, in O(n²) work. */
export const calculateKendallTau = (
  input: unknown,
): ToolResult<KendallTauOutput> => {
  const parsed = validateRankCorrelationInput(input);
  if (!parsed.ok) return parsed;
  const { first, second } = parsed.output;
  let concordant = 0,
    discordant = 0,
    tiedInBoth = 0,
    tiedInFirstOnly = 0,
    tiedInSecondOnly = 0;
  first.forEach((x, i) =>
    first.slice(i + 1).forEach((otherX, offset) => {
      const j = i + 1 + offset;
      const y = second[i] ?? 0,
        otherY = second[j] ?? 0;
      if (x === otherX && y === otherY) tiedInBoth += 1;
      else if (x === otherX) tiedInFirstOnly += 1;
      else if (y === otherY) tiedInSecondOnly += 1;
      else if (x < otherX === y < otherY) concordant += 1;
      else discordant += 1;
    }),
  );
  const denominator = Math.sqrt(
    (concordant + discordant + tiedInFirstOnly) *
      (concordant + discordant + tiedInSecondOnly),
  );
  if (denominator === 0)
    return invalidInput([
      {
        code: "undefined_correlation",
        field: "first",
        message: "Kendall tau-b is undefined when either series is constant.",
      },
    ]);
  return toolSuccess({
    concordant,
    discordant,
    tauB: (concordant - discordant) / denominator,
    tiedInBoth,
    tiedInFirstOnly,
    tiedInSecondOnly,
  });
};
export const kendallTauExample = {
  input: { first: [1, 2, 3, 4, 5], second: [1, 3, 2, 4, 5] },
  output: {
    concordant: 9,
    discordant: 1,
    tauB: 0.8,
    tiedInBoth: 0,
    tiedInFirstOnly: 0,
    tiedInSecondOnly: 0,
  },
} satisfies ToolExample<KendallTauInput, KendallTauOutput>;
export const kendallTauTool = defineTool<KendallTauInput, KendallTauOutput>({
  contractVersion: 1,
  description:
    "Calculate tie-adjusted Kendall tau-b and disjoint concordant, discordant, and tied pair counts, without a p-value approximation.",
  execute: calculateKendallTau,
  execution: { kind: "pure" },
  id: "statistics/kendall-tau",
  inputSchema: kendallTauInputSchema,
  outputSchema: kendallTauOutputSchema,
  ports: {
    inputs: rankCorrelationInputPorts,
    outputs: [
      {
        id: "concordant",
        label: "Concordant pairs",
        valueType: { type: "integer" },
      },
      {
        id: "discordant",
        label: "Discordant pairs",
        valueType: { type: "integer" },
      },
      { id: "tauB", label: "Kendall tau-b", valueType: { type: "number" } },
      {
        id: "tiedInBoth",
        label: "Pairs tied in both series",
        valueType: { type: "integer" },
      },
      {
        id: "tiedInFirstOnly",
        label: "Pairs tied only in the first series",
        valueType: { type: "integer" },
      },
      {
        id: "tiedInSecondOnly",
        label: "Pairs tied only in the second series",
        valueType: { type: "integer" },
      },
    ],
  },
  title: "Kendall Tau-b Rank Correlation Calculator",
});
export const runKendallTau = kendallTauTool.execute;
export default kendallTauTool;
