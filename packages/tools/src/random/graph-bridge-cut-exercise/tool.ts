import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import {
  recursiveTree,
  components,
  edgeKey,
  type Edge,
} from "../m500b-charts-math-graphs-graphs.js";

export type GraphBridgeCutExerciseInput = {
  readonly nodes: readonly string[];
  readonly chordCount: number;
  readonly seed?: number;
};
export type GraphBridgeCutExerciseOutput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly candidateIndex: number;
  readonly beforeComponents: number;
  readonly afterComponents: number;
  readonly bridge: boolean;
  readonly removalComponents: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    nodes: array(label, 16, 2),
    chordCount: { type: "integer", minimum: 0, maximum: 4 },
    seed: generatorSeedSchema,
  },
  ["nodes", "chordCount"],
);
export const outputSchema = object({
  nodes: array(label, 16, 2),
  edges: array(array(label, 2, 2), 19, 1),
  candidateIndex: integer,
  beforeComponents: integer,
  afterComponents: integer,
  bridge: bool,
  removalComponents: array(integer, 19, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is GraphBridgeCutExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateGraphBridgeCutExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GraphBridgeCutExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const edges = recursiveTree(input.nodes, random);
    for (let k = 0; k < input.chordCount; k++) {
      const candidates: Edge[] = [];
      for (let i = 0; i < input.nodes.length; i++)
        for (let j = i + 1; j < input.nodes.length; j++)
          if (
            !edges.some(
              ([a, b]) =>
                edgeKey(a, b) === edgeKey(input.nodes[i], input.nodes[j]),
            )
          )
            candidates.push([input.nodes[i], input.nodes[j]]);
      if (!candidates.length)
        simpleError(
          "chordCount",
          "Requested distinct chords exceed the complete graph.",
          "infeasible_chords",
        );
      edges.push(random.pick(candidates));
    }
    const candidateIndex = random.integer(0, edges.length - 1),
      beforeComponents = components(input.nodes, edges),
      removalComponents = edges.map((_, i) =>
        components(
          input.nodes,
          edges.filter((_, j) => i !== j),
        ),
      ),
      afterComponents = removalComponents[candidateIndex];
    const result = {
      nodes: [...input.nodes],
      edges,
      candidateIndex,
      beforeComponents,
      afterComponents,
      bridge: afterComponents > beforeComponents,
      removalComponents,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const graphBridgeCutExerciseExample = {
  input: { nodes: ["a", "b", "c", "d"], chordCount: 0, seed: 42 },
  output: {
    nodes: ["a", "b", "c", "d"],
    edges: [
      ["a", "b"],
      ["a", "c"],
      ["c", "d"],
    ],
    candidateIndex: 2,
    beforeComponents: 1,
    afterComponents: 2,
    bridge: true,
    removalComponents: [2, 2, 2],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GraphBridgeCutExerciseInput,
  GraphBridgeCutExerciseOutput
>;
export const graphBridgeCutExerciseTool = createModelDefinition<
  GraphBridgeCutExerciseInput,
  GraphBridgeCutExerciseOutput
>({
  id: "random/graph-bridge-cut-exercise",
  title: "Random Graph Bridge Cut Exercise Generator",
  description:
    "Construct a recursive connected graph with optional chords and label candidate/all-edge removals by delegated component changes.",
  inputSchema,
  outputSchema,
  execute: calculateGraphBridgeCutExercise,
});
export const runGraphBridgeCutExercise = graphBridgeCutExerciseTool.execute;
export default graphBridgeCutExerciseTool;
