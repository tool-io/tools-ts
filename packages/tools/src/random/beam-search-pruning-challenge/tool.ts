import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  beamSearch,
  type BeamNode,
  type BeamSearchResult,
} from "../../search/beam-search/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  labelSchema,
  integerSchema,
  numberSchema,
  nullable,
  safeRange,
} from "../m250-algorithms-common.js";

export type BeamSearchPruningChallengeInput = {
  readonly branchingFactor: number;
  readonly treeDepth: number;
  readonly searchDepth: number;
  readonly width: number;
  readonly minimumScore: number;
  readonly maximumScore: number;
  readonly seed?: number;
};
export type BeamChallengeNode = {
  readonly label: string;
  readonly parent: string | null;
  readonly depth: number;
  readonly score: number;
};
export type BeamSearchPruningChallengeOutput = {
  readonly nodes: readonly BeamChallengeNode[];
  readonly beam: BeamSearchResult;
  readonly comparison: {
    readonly depth: number;
    readonly exhaustivePathCount: number;
    readonly exhaustiveBestPath: readonly string[];
    readonly exhaustiveBestScore: number;
    readonly gap: number;
    readonly beamIsOptimal: boolean;
  };
  readonly convention: string;
  readonly randomness: GeneratorReplay;
};
const pathSchema = arraySchema(labelSchema, 6, 1);
export const inputSchema = objectSchema(
  {
    branchingFactor: integerSchema(2, 4),
    treeDepth: integerSchema(1, 5),
    searchDepth: integerSchema(1, 5),
    width: integerSchema(1, 16),
    minimumScore: { type: "integer" },
    maximumScore: { type: "integer" },
    seed: generatorSeedSchema,
  },
  [
    "branchingFactor",
    "treeDepth",
    "searchDepth",
    "width",
    "minimumScore",
    "maximumScore",
  ],
);
export const outputSchema = objectSchema({
  nodes: arraySchema(
    objectSchema({
      label: labelSchema,
      parent: nullable(labelSchema),
      depth: integerSchema(0, 5),
      score: { type: "integer" },
    }),
    341,
    3,
  ),
  beam: objectSchema({
    bestPath: pathSchema,
    bestScore: numberSchema,
    levels: arraySchema(
      objectSchema({
        kept: arraySchema({ type: "string" }, 16, 1),
        pruned: arraySchema({ type: "string" }, 64),
      }),
      5,
      1,
    ),
  }),
  comparison: objectSchema({
    depth: integerSchema(1, 5),
    exhaustivePathCount: integerSchema(2, 256),
    exhaustiveBestPath: pathSchema,
    exhaustiveBestScore: numberSchema,
    gap: numberSchema,
    beamIsOptimal: { type: "boolean" },
  }),
  convention: { type: "string" },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is BeamSearchPruningChallengeInput =>
  matchesModelInput(input, inputSchema);
export const calculateBeamSearchPruningChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BeamSearchPruningChallengeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.searchDepth > input.treeDepth)
      simpleError(
        "searchDepth",
        "Compare at a depth contained in the generated tree.",
        "search_depth_exceeds_tree",
      );
    let nodeCount = 1,
      levelCount = 1;
    for (let i = 0; i < input.treeDepth; i += 1) {
      levelCount *= input.branchingFactor;
      nodeCount += levelCount;
    }
    if (nodeCount > 341)
      simpleError(
        "treeDepth",
        "A generated complete tree may contain at most 341 nodes.",
        "resource_limit",
      );
    safeRange(input.minimumScore, input.maximumScore, "maximumScore");
    if (
      ![
        input.minimumScore * input.treeDepth,
        input.maximumScore * input.treeDepth,
        (input.maximumScore - input.minimumScore) * input.searchDepth,
      ].every(Number.isSafeInteger)
    )
      simpleError(
        "maximumScore",
        "All cumulative integer path scores and comparison gaps must remain safe integers.",
        "score_precision_loss",
      );
    const random = createGeneratorRandom(input.seed, context),
      nodes: BeamChallengeNode[] = [];
    const grow = (parent: string | null, depth: number): BeamNode => {
      const label = `n${String(nodes.length).padStart(3, "0")}`,
        score =
          depth === 0
            ? 0
            : random.integer(input.minimumScore, input.maximumScore);
      nodes.push({ label, parent, depth, score });
      return depth === input.treeDepth
        ? { label, score }
        : {
            label,
            score,
            children: Array.from({ length: input.branchingFactor }, () =>
              grow(label, depth + 1),
            ),
          };
    };
    const tree = grow(null, 0),
      beam = beamSearch(tree, input.width, input.searchDepth);
    if (!beam)
      throw new Error(
        "Generated bounded scored tree failed beam-search validation.",
      );
    const paths: { path: string[]; score: number }[] = [];
    const enumerate = (
      node: BeamNode,
      path: readonly string[],
      score: number,
      depth: number,
    ): void => {
      const nextPath = [...path, node.label],
        nextScore = score + node.score;
      if (depth === input.searchDepth)
        paths.push({ path: nextPath, score: nextScore });
      else
        for (const child of node.children ?? [])
          enumerate(child, nextPath, nextScore, depth + 1);
    };
    enumerate(tree, [], 0, 0);
    paths.sort(
      (a, b) =>
        b.score - a.score || a.path.join("> ").localeCompare(b.path.join("> ")),
    );
    const best = paths[0];
    if (!best)
      throw new Error(
        "A complete tree did not contain the requested comparison depth.",
      );
    return toolSuccess({
      nodes,
      beam,
      comparison: {
        depth: input.searchDepth,
        exhaustivePathCount: paths.length,
        exhaustiveBestPath: best.path,
        exhaustiveBestScore: best.score,
        gap: best.score - beam.bestScore,
        beamIsOptimal: best.score === beam.bestScore,
      },
      convention:
        "Scores are cumulative node increments from a zero-score root. Compare paths at the same depth; ties use the core's ascending path-label convention. Beam pruning may discard the exhaustive optimum.",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const beamSearchPruningChallengeExample = {
  input: {
    branchingFactor: 2,
    treeDepth: 2,
    searchDepth: 2,
    width: 1,
    minimumScore: -5,
    maximumScore: 5,
    seed: 42,
  },
  output: {
    nodes: [
      { label: "n000", parent: null, depth: 0, score: 0 },
      { label: "n001", parent: "n000", depth: 1, score: 1 },
      { label: "n002", parent: "n001", depth: 2, score: -1 },
      { label: "n003", parent: "n001", depth: 2, score: 4 },
      { label: "n004", parent: "n000", depth: 1, score: 2 },
      { label: "n005", parent: "n004", depth: 2, score: -4 },
      { label: "n006", parent: "n004", depth: 2, score: 0 },
    ],
    beam: {
      bestPath: ["n000", "n004", "n006"],
      bestScore: 2,
      levels: [
        { kept: ["n000 > n004"], pruned: ["n000 > n001"] },
        { kept: ["n000 > n004 > n006"], pruned: ["n000 > n004 > n005"] },
      ],
    },
    comparison: {
      depth: 2,
      exhaustivePathCount: 4,
      exhaustiveBestPath: ["n000", "n001", "n003"],
      exhaustiveBestScore: 5,
      gap: 3,
      beamIsOptimal: false,
    },
    convention:
      "Scores are cumulative node increments from a zero-score root. Compare paths at the same depth; ties use the core's ascending path-label convention. Beam pruning may discard the exhaustive optimum.",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BeamSearchPruningChallengeInput,
  BeamSearchPruningChallengeOutput
>;
export const beamSearchPruningChallengeTool = createModelDefinition<
  BeamSearchPruningChallengeInput,
  BeamSearchPruningChallengeOutput
>({
  id: "random/beam-search-pruning-challenge",
  title: "Random Beam Search Pruning Challenge Generator",
  description:
    "Grow a bounded scored tree and delegate beam traces, comparing the result with exhaustive best paths at the same depth to expose pruning losses.",
  inputSchema,
  outputSchema,
  execute: calculateBeamSearchPruningChallenge,
});
export const runBeamSearchPruningChallenge =
  beamSearchPruningChallengeTool.execute;
export default beamSearchPruningChallengeTool;
