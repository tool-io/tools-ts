import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  integer,
  object,
  label,
  countsSchema,
  run,
  pick,
  distinct,
  counts,
  finite,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
type Model = {
  readonly id: string;
  readonly requirementsSource: string;
  readonly minimumSize: number;
  readonly maximumWeight: number;
  readonly requiredTags: readonly string[];
};
type Paper = {
  readonly id: string;
  readonly size: number;
  readonly weight: number;
  readonly stock: number;
  readonly tags: readonly string[];
};
export type OrigamiPaperSelectionDeckInput = AcSeed & {
  readonly models: readonly Model[];
  readonly papers: readonly Paper[];
  readonly count: number;
};
type Pair = { readonly modelId: string; readonly paperId: string };
export type OrigamiPaperSelectionDeckOutput = AcReplay & {
  readonly compatiblePairs: readonly Pair[];
  readonly cards: readonly Pair[];
  readonly modelCounts: readonly AcCount[];
  readonly paperCounts: readonly AcCount[];
  readonly remainingStock: readonly {
    readonly id: string;
    readonly count: number;
  }[];
};
const tags = array(label, 16),
  pair = object({ modelId: label, paperId: label });
export const inputSchema = inputObject({
  models: array(
    object({
      id: label,
      requirementsSource: label,
      minimumSize: positive,
      maximumWeight: positive,
      requiredTags: tags,
    }),
    16,
    1,
  ),
  papers: array(
    object({
      id: label,
      size: positive,
      weight: positive,
      stock: integer(0, 128),
      tags,
    }),
    16,
    1,
  ),
  count: integer(1, 32),
});
export const outputSchema = outputObject({
  compatiblePairs: array(pair, 256),
  cards: array(pair, 32, 1),
  modelCounts: countsSchema,
  paperCounts: countsSchema,
  remainingStock: array(object({ id: label, count: integer(0, 128) }), 16, 1),
});
const isInput = (v: unknown): v is OrigamiPaperSelectionDeckInput =>
  matchesModelInput(v, inputSchema);
export const calculateOrigamiPaperSelectionDeck = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<OrigamiPaperSelectionDeckOutput, "randomness"> => {
      distinct(
        x.models.map((m) => m.id),
        "models",
      );
      distinct(
        x.papers.map((p) => p.id),
        "papers",
      );
      x.models.forEach((m) => distinct(m.requiredTags, "models"));
      x.papers.forEach((p) => distinct(p.tags, "papers"));
      const compatible = x.models.flatMap((m) =>
        x.papers.flatMap((p, j) =>
          p.size >= m.minimumSize &&
          p.weight <= m.maximumWeight &&
          m.requiredTags.every((t) => p.tags.includes(t))
            ? [{ modelId: m.id, paperId: p.id, index: j }]
            : [],
        ),
      );
      const usable = new Set(compatible.map((p) => p.index));
      if (
        x.papers.reduce((s, p, i) => s + (usable.has(i) ? p.stock : 0), 0) <
        x.count
      )
        return simpleError(
          "count",
          "Compatible supplied paper stock cannot fill the deck.",
          "insufficient_compatible_stock",
        );
      const remaining = x.papers.map((p) => p.stock),
        cards = Array.from({ length: x.count }, () => {
          const p = pick(
            compatible.filter((p) => remaining[p.index] > 0),
            random,
          );
          remaining[p.index]--;
          return { modelId: p.modelId, paperId: p.paperId };
        });
      return {
        compatiblePairs: compatible.map(({ modelId, paperId }) => ({
          modelId,
          paperId,
        })),
        cards,
        modelCounts: counts(
          cards.map((p) => p.modelId),
          x.models.map((m) => m.id),
        ),
        paperCounts: counts(
          cards.map((p) => p.paperId),
          x.papers.map((p) => p.id),
        ),
        remainingStock: x.papers.map((p, i) => ({
          id: p.id,
          count: finite(remaining[i]),
        })),
      };
    },
  );
export const origamiPaperSelectionDeckExample = {
  input: {
    models: [
      {
        id: "bird",
        requirementsSource: "caller reviewed model",
        minimumSize: 10,
        maximumWeight: 100,
        requiredTags: ["thin"],
      },
    ],
    papers: [{ id: "blue", size: 15, weight: 80, stock: 2, tags: ["thin"] }],
    count: 2,
    seed: 42,
  },
  output: {
    compatiblePairs: [{ modelId: "bird", paperId: "blue" }],
    cards: [
      { modelId: "bird", paperId: "blue" },
      { modelId: "bird", paperId: "blue" },
    ],
    modelCounts: [{ id: "bird", count: 2 }],
    paperCounts: [{ id: "blue", count: 2 }],
    remainingStock: [{ id: "blue", count: 0 }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  OrigamiPaperSelectionDeckInput,
  OrigamiPaperSelectionDeckOutput
>;
export const origamiPaperSelectionDeckTool = createModelDefinition<
  OrigamiPaperSelectionDeckInput,
  OrigamiPaperSelectionDeckOutput
>({
  id: "random/origami-paper-selection-deck",
  title: "Random Origami Paper Selection Deck Generator",
  description:
    "Match caller-reviewed size, weight and tag requirements to supplied paper stock and sample compatible model/paper pairs without inventing suitability facts.",
  inputSchema,
  outputSchema,
  execute: calculateOrigamiPaperSelectionDeck,
});
export const runOrigamiPaperSelectionDeck =
  origamiPaperSelectionDeckTool.execute;
export default origamiPaperSelectionDeckTool;
