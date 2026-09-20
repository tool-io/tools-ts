import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { calculatePearsonCorrelation } from "../pearson-correlation/tool.js";
import {
  calculateAverageRanks,
  rankCorrelationInputPorts,
  rankCorrelationInputSchema,
  validateRankCorrelationInput,
  type RankCorrelationInput,
} from "../rank-correlation-input.js";

export type SpearmanRankCorrelationInput = RankCorrelationInput;
export type SpearmanRankCorrelationOutput = {
  readonly correlation: number;
  readonly firstRanks: readonly number[];
  readonly secondRanks: readonly number[];
};
export const spearmanRankCorrelationInputSchema = rankCorrelationInputSchema;
export const spearmanRankCorrelationOutputSchema = {
  additionalProperties: false,
  properties: {
    correlation: { maximum: 1, minimum: -1, type: "number" },
    firstRanks: {
      items: { type: "number" },
      maxItems: 512,
      minItems: 2,
      type: "array",
    },
    secondRanks: {
      items: { type: "number" },
      maxItems: 512,
      minItems: 2,
      type: "array",
    },
  },
  required: ["correlation", "firstRanks", "secondRanks"],
  type: "object",
} as const;
/** Pearson correlation of one-based average ranks; ties are not broken arbitrarily. */
export const calculateSpearmanRankCorrelation = (
  input: unknown,
): ToolResult<SpearmanRankCorrelationOutput> => {
  const parsed = validateRankCorrelationInput(input);
  if (!parsed.ok) return parsed;
  const firstRanks = calculateAverageRanks(parsed.output.first);
  const secondRanks = calculateAverageRanks(parsed.output.second);
  const correlation = calculatePearsonCorrelation(firstRanks, secondRanks);
  if (correlation === null)
    return invalidInput([
      {
        code: "undefined_correlation",
        field: "first",
        message:
          "Spearman correlation is undefined when either series is constant.",
      },
    ]);
  return toolSuccess({ correlation, firstRanks, secondRanks });
};
export const spearmanRankCorrelationExample = {
  input: { first: [10, 20, 30], second: [30, 10, 20] },
  output: { correlation: -0.5, firstRanks: [1, 2, 3], secondRanks: [3, 1, 2] },
} satisfies ToolExample<
  SpearmanRankCorrelationInput,
  SpearmanRankCorrelationOutput
>;
export const spearmanRankCorrelationTool = defineTool<
  SpearmanRankCorrelationInput,
  SpearmanRankCorrelationOutput
>({
  contractVersion: 1,
  description:
    "Calculate Spearman correlation using one-based average ranks and the existing Pearson calculation's numeric precision, returning both rank vectors without a p-value.",
  execute: calculateSpearmanRankCorrelation,
  execution: { kind: "pure" },
  id: "statistics/spearman-rank-correlation",
  inputSchema: spearmanRankCorrelationInputSchema,
  outputSchema: spearmanRankCorrelationOutputSchema,
  ports: {
    inputs: rankCorrelationInputPorts,
    outputs: [
      {
        id: "correlation",
        label: "Spearman correlation",
        valueType: { type: "number" },
      },
      {
        id: "firstRanks",
        label: "First average ranks",
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "secondRanks",
        label: "Second average ranks",
        valueType: { items: { type: "number" }, type: "list" },
      },
    ],
  },
  title: "Spearman Rank Correlation Calculator",
});
export const runSpearmanRankCorrelation = spearmanRankCorrelationTool.execute;
export default spearmanRankCorrelationTool;
