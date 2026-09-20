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

export type GraphArticulationPointExerciseInput = {
  readonly nodes: readonly string[];
  readonly chordCount: number;
  readonly seed?: number;
};
export type GraphArticulationPointExerciseOutput = {
  readonly nodes: readonly string[];
  readonly edges: readonly Edge[];
  readonly candidate: string;
  readonly beforeComponents: number;
  readonly afterComponents: number;
  readonly articulation: boolean;
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
  candidate: label,
  beforeComponents: integer,
  afterComponents: integer,
  articulation: bool,
  removalComponents: array(integer, 16, 2),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is GraphArticulationPointExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateGraphArticulationPointExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<GraphArticulationPointExerciseOutput> => {
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
          "Requested chords exceed the simple graph.",
          "infeasible_chords",
        );
      edges.push(random.pick(candidates));
    }
    const candidate = random.pick(input.nodes),
      beforeComponents = components(input.nodes, edges),
      removalComponents = input.nodes.map((n) =>
        components(
          input.nodes.filter((x) => x !== n),
          edges.filter((e) => !e.includes(n)),
        ),
      ),
      afterComponents = removalComponents[input.nodes.indexOf(candidate)];
    const result = {
      nodes: [...input.nodes],
      edges,
      candidate,
      beforeComponents,
      afterComponents,
      articulation: afterComponents > beforeComponents,
      removalComponents,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const graphArticulationPointExerciseExample = {
  input: { nodes: ["a", "b", "c", "d"], chordCount: 0, seed: 42 },
  output: {
    nodes: ["a", "b", "c", "d"],
    edges: [
      ["a", "b"],
      ["a", "c"],
      ["c", "d"],
    ],
    candidate: "c",
    beforeComponents: 1,
    afterComponents: 2,
    articulation: true,
    removalComponents: [2, 1, 2, 1],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GraphArticulationPointExerciseInput,
  GraphArticulationPointExerciseOutput
>;
export const graphArticulationPointExerciseTool = createModelDefinition<
  GraphArticulationPointExerciseInput,
  GraphArticulationPointExerciseOutput
>({
  id: "random/graph-articulation-point-exercise",
  title: "Random Graph Articulation Point Exercise Generator",
  description:
    "Construct candidate cut-vertex exercises and verify each vertex removal using connected-component counts, with bounded optional chords.",
  inputSchema,
  outputSchema,
  execute: calculateGraphArticulationPointExercise,
});
export const runGraphArticulationPointExercise =
  graphArticulationPointExerciseTool.execute;
export default graphArticulationPointExerciseTool;
