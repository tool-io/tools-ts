import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UctCandidate = {
  readonly action: string;
  readonly totalValue: number;
  readonly visits: number;
};
export type UctScore = UctCandidate & {
  readonly meanValue: number;
  readonly score: number;
};
export const rankAlphaBetaUct = (
  candidates: readonly UctCandidate[],
  parentVisits: number,
  exploration: number,
  alpha: number,
  beta: number,
): UctScore[] | null => {
  if (
    !candidates.length ||
    alpha > beta ||
    candidates.some(
      ({ action, totalValue, visits }) =>
        !action.trim() ||
        !Number.isFinite(totalValue) ||
        !Number.isSafeInteger(visits) ||
        visits < 0,
    )
  )
    return null;
  return candidates
    .map((candidate) => {
      const meanValue = candidate.visits
        ? candidate.totalValue / candidate.visits
        : 0;
      const uct = candidate.visits
        ? meanValue +
          exploration *
            Math.sqrt(Math.log(Math.max(1, parentVisits)) / candidate.visits)
        : Infinity;
      return {
        ...candidate,
        meanValue: Number(meanValue.toPrecision(12)),
        score: Number(Math.min(beta, Math.max(alpha, uct)).toPrecision(12)),
      };
    })
    .sort(
      (first, second) =>
        second.score - first.score || first.action.localeCompare(second.action),
    );
};
export const alphaBetaUctExample = {
  input: {
    alpha: -1,
    beta: 2,
    candidates: {
      values: [
        { action: "A", totalValue: 4, visits: 5 },
        { action: "B", totalValue: 2, visits: 2 },
      ],
    },
    exploration: 1.4,
    parentVisits: 10,
  },
  output: {
    ranking: {
      values: [
        { action: "B", meanValue: 1, score: 2, totalValue: 2, visits: 2 },
        {
          action: "A",
          meanValue: 0.8,
          score: 1.75005965942,
          totalValue: 4,
          visits: 5,
        },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly alpha: number;
    readonly beta: number;
    readonly candidates: { readonly values: readonly UctCandidate[] };
    readonly exploration: number;
    readonly parentVisits: number;
  },
  { readonly ranking: { readonly values: readonly UctScore[] } }
>;
export const alphaBetaUctTool = createSimpleTool({
  id: "game-search/alpha-beta-uct",
  title: "Alpha-Beta UCT Calculator",
  description:
    "Rank Monte Carlo tree-search actions with UCT scores constrained by alpha and beta bounds.",
  inputs: [
    {
      format: "search/uct-candidates",
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
    { id: "alpha", kind: "number", label: "Alpha bound" },
    { id: "beta", kind: "number", label: "Beta bound" },
  ],
  outputs: [
    {
      format: "search/uct-ranking",
      id: "ranking",
      kind: "object",
      label: "UCT ranking",
    },
  ],
  calculate: (input) => {
    const candidates = (input.candidates as { values?: unknown }).values;
    if (!Array.isArray(candidates))
      return simpleError("candidates", "Enter candidates in a values array.");
    const values = rankAlphaBetaUct(
      candidates as UctCandidate[],
      input.parentVisits as number,
      input.exploration as number,
      input.alpha as number,
      input.beta as number,
    );
    if (!values)
      return simpleError(
        "candidates",
        "Enter valid candidates and ordered alpha-beta bounds.",
      );
    return { ranking: { values } };
  },
});
export const runAlphaBetaUct = alphaBetaUctTool.execute;
export default alphaBetaUctTool;
