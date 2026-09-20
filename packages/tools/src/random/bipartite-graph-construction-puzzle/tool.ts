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
import { runBipartiteChecker } from "../../graph/bipartite-checker/tool.js";
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
  probabilitySchema,
  integerSchema,
} from "../m250-algorithms-common.js";
import {
  algorithmCanonicalEdges,
  algorithmEdgesSchema,
  type AlgorithmEdge,
} from "../m250-algorithms-graphs.js";

export type BipartiteGraphConstructionPuzzleInput = {
  readonly vertexCount: number;
  readonly leftCount: number;
  readonly extraEdgeProbability: number;
  readonly hiddenEdgeCount: number;
  readonly mode: "bipartite" | "odd-cycle";
  readonly seed?: number;
};
export type BipartiteGraphConstructionPuzzleOutput = {
  readonly vertexCount: number;
  readonly mode: "bipartite" | "odd-cycle";
  readonly partition: {
    readonly left: readonly number[];
    readonly right: readonly number[];
  };
  readonly visibleEdges: readonly AlgorithmEdge[];
  readonly missingEdges: readonly AlgorithmEdge[];
  readonly solutionEdges: readonly AlgorithmEdge[];
  readonly oddCycle: readonly number[];
  readonly visibleCheck: {
    readonly bipartite: boolean;
    readonly colors: readonly number[];
  };
  readonly solutionCheck: {
    readonly bipartite: boolean;
    readonly colors: readonly number[];
  };
  readonly uniqueCompletionClaimed: boolean;
  readonly randomness: GeneratorReplay;
};
const vertices = arraySchema(integerSchema(0, 11), 12),
  checkSchema = objectSchema({
    bipartite: { type: "boolean" },
    colors: arraySchema(integerSchema(-1, 1), 12, 3),
  });
export const inputSchema = objectSchema(
  {
    vertexCount: integerSchema(3, 12),
    leftCount: integerSchema(1, 11),
    extraEdgeProbability: probabilitySchema,
    hiddenEdgeCount: integerSchema(0, 66),
    mode: { type: "string", enum: ["bipartite", "odd-cycle"] },
    seed: generatorSeedSchema,
  },
  [
    "vertexCount",
    "leftCount",
    "extraEdgeProbability",
    "hiddenEdgeCount",
    "mode",
  ],
);
export const outputSchema = objectSchema({
  vertexCount: integerSchema(3, 12),
  mode: { type: "string", enum: ["bipartite", "odd-cycle"] },
  partition: objectSchema({ left: vertices, right: vertices }),
  visibleEdges: algorithmEdgesSchema,
  missingEdges: algorithmEdgesSchema,
  solutionEdges: algorithmEdgesSchema,
  oddCycle: vertices,
  visibleCheck: checkSchema,
  solutionCheck: checkSchema,
  uniqueCompletionClaimed: { type: "boolean", const: false },
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is BipartiteGraphConstructionPuzzleInput =>
  matchesModelInput(input, inputSchema);
const check = (vertexCount: number, edges: readonly AlgorithmEdge[]) => {
  const result = runBipartiteChecker({
    vertexCount,
    edges: edges.map(([a, b]) => [a, b]),
  });
  if (!result.ok)
    throw new Error(
      "A bounded constructed graph failed bipartite-checker input validation.",
    );
  return {
    bipartite: result.output.bipartite,
    colors: [...result.output.colors],
  };
};
export const calculateBipartiteGraphConstructionPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BipartiteGraphConstructionPuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.leftCount >= input.vertexCount ||
      (input.mode === "odd-cycle" && input.leftCount < 2)
    )
      simpleError(
        "leftCount",
        "Keep both sides nonempty, with two left vertices for a triangle control.",
        "infeasible_partition",
      );
    const random = createGeneratorRandom(input.seed, context),
      permutation = random.shuffle(
        Array.from({ length: input.vertexCount }, (_, i) => i),
      );
    const left = permutation.slice(0, input.leftCount),
      right = permutation.slice(input.leftCount),
      base: AlgorithmEdge[] = [];
    for (const a of left)
      for (const b of right)
        if (
          a === left[0] ||
          b === right[0] ||
          random.unit() < input.extraEdgeProbability
        )
          base.push([a, b]);
    const oddCycle =
      input.mode === "odd-cycle" ? [left[0], right[0], left[1], left[0]] : [];
    if (input.mode === "odd-cycle") base.push([left[0], left[1]]);
    const solutionEdges = algorithmCanonicalEdges(base);
    if (input.hiddenEdgeCount > solutionEdges.length)
      simpleError(
        "hiddenEdgeCount",
        "The hidden edge count must fit the constructed graph.",
        "infeasible_hidden_count",
      );
    const shuffled = random.shuffle(solutionEdges),
      missingEdges = algorithmCanonicalEdges(
        shuffled.slice(0, input.hiddenEdgeCount),
      ),
      visibleEdges = algorithmCanonicalEdges(
        shuffled.slice(input.hiddenEdgeCount),
      );
    const solutionCheck = check(input.vertexCount, solutionEdges),
      visibleCheck = check(input.vertexCount, visibleEdges);
    if (solutionCheck.bipartite !== (input.mode === "bipartite"))
      throw new Error(
        "The constructed control disagrees with the bipartite core.",
      );
    return toolSuccess({
      vertexCount: input.vertexCount,
      mode: input.mode,
      partition: { left, right },
      visibleEdges,
      missingEdges,
      solutionEdges,
      oddCycle,
      visibleCheck,
      solutionCheck,
      uniqueCompletionClaimed: false,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bipartiteGraphConstructionPuzzleExample = {
  input: {
    vertexCount: 4,
    leftCount: 2,
    extraEdgeProbability: 0.5,
    hiddenEdgeCount: 1,
    mode: "odd-cycle",
    seed: 42,
  },
  output: {
    vertexCount: 4,
    mode: "odd-cycle",
    partition: { left: [0, 3], right: [1, 2] },
    visibleEdges: [
      [0, 1],
      [0, 2],
      [1, 3],
    ],
    missingEdges: [[0, 3]],
    solutionEdges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
    ],
    oddCycle: [0, 1, 3, 0],
    visibleCheck: { bipartite: true, colors: [0, 1, 1, 0] },
    solutionCheck: { bipartite: false, colors: [0, 1, 1, 1] },
    uniqueCompletionClaimed: false,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BipartiteGraphConstructionPuzzleInput,
  BipartiteGraphConstructionPuzzleOutput
>;
export const bipartiteGraphConstructionPuzzleTool = createModelDefinition<
  BipartiteGraphConstructionPuzzleInput,
  BipartiteGraphConstructionPuzzleOutput
>({
  id: "random/bipartite-graph-construction-puzzle",
  title: "Random Bipartite Graph Construction Puzzle Generator",
  description:
    "Construct a connected bipartite graph or triangle control, hide selected edges and return core-checked completions without claiming uniqueness.",
  inputSchema,
  outputSchema,
  execute: calculateBipartiteGraphConstructionPuzzle,
});
export const runBipartiteGraphConstructionPuzzle =
  bipartiteGraphConstructionPuzzleTool.execute;
export default bipartiteGraphConstructionPuzzleTool;
