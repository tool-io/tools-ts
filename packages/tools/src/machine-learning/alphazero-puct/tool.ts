import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PuctCandidate = {
  readonly action: string;
  readonly prior: number;
  readonly totalValue: number;
  readonly visits: number;
};
export type PuctScore = PuctCandidate & {
  readonly meanValue: number;
  readonly score: number;
};
export const rankAlphaZeroPuct = (
  candidates: readonly PuctCandidate[],
  parentVisits: number,
  exploration: number,
): PuctScore[] | null => {
  if (
    !candidates.length ||
    candidates.some(
      ({ action, prior, totalValue, visits }) =>
        !action.trim() ||
        prior < 0 ||
        visits < 0 ||
        !Number.isSafeInteger(visits) ||
        !Number.isFinite(totalValue),
    )
  )
    return null;
  return candidates
    .map((candidate) => {
      const meanValue = candidate.visits
        ? candidate.totalValue / candidate.visits
        : 0;
      const score =
        meanValue +
        (exploration * candidate.prior * Math.sqrt(parentVisits)) /
          (1 + candidate.visits);
      return {
        ...candidate,
        meanValue: Number(meanValue.toPrecision(12)),
        score: Number(score.toPrecision(12)),
      };
    })
    .sort((a, b) => b.score - a.score || a.action.localeCompare(b.action));
};
export const alphaZeroPuctExample = {
  input: {
    candidates: {
      values: [
        { action: "left", prior: 0.6, totalValue: 4, visits: 5 },
        { action: "right", prior: 0.4, totalValue: 3, visits: 3 },
      ],
    },
    exploration: 1.5,
    parentVisits: 8,
  },
  output: {
    ranking: {
      values: [
        {
          action: "right",
          meanValue: 1,
          prior: 0.4,
          score: 1.42426406871,
          totalValue: 3,
          visits: 3,
        },
        {
          action: "left",
          meanValue: 0.8,
          prior: 0.6,
          score: 1.22426406871,
          totalValue: 4,
          visits: 5,
        },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly candidates: { readonly values: readonly PuctCandidate[] };
    readonly exploration: number;
    readonly parentVisits: number;
  },
  { readonly ranking: { readonly values: readonly PuctScore[] } }
>;
export const alphaZeroPuctTool = createSimpleTool({
  id: "machine-learning/alphazero-puct",
  title: "AlphaZero PUCT Calculator",
  description:
    "Rank candidate actions with the prior-guided upper confidence formula used by AlphaZero-style search.",
  inputs: [
    {
      format: "search/puct-candidates",
      id: "candidates",
      kind: "object",
      label: "Candidates",
    },
    { id: "parentVisits", kind: "integer", label: "Parent visits", minimum: 1 },
    {
      id: "exploration",
      kind: "number",
      label: "Exploration constant",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "search/puct-ranking",
      id: "ranking",
      kind: "object",
      label: "PUCT ranking",
    },
  ],
  calculate: (input) => {
    const candidates = (input.candidates as { values?: unknown }).values;
    if (!Array.isArray(candidates))
      return simpleError("candidates", "Enter candidates in a values array.");
    const values = rankAlphaZeroPuct(
      candidates as PuctCandidate[],
      input.parentVisits as number,
      input.exploration as number,
    );
    if (!values)
      return simpleError(
        "candidates",
        "Enter valid actions, priors, values, and visit counts.",
      );
    return { ranking: { values } };
  },
});
export const runAlphaZeroPuct = alphaZeroPuctTool.execute;
export default alphaZeroPuctTool;
