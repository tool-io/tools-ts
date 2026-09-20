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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  alphaBetaSearch,
  type GameTree,
  type AlphaBetaResult,
} from "../../game-search/alpha-beta/tool.js";

export type MinimaxGameTreeTestCaseInput = {
  readonly branchingFactor: number;
  readonly depth: number;
  readonly minimumLeafValue: number;
  readonly maximumLeafValue: number;
  readonly maximizing: boolean;
  readonly seed?: number;
};
export type GeneratedGameTreeNode =
  | {
      readonly id: number;
      readonly depth: number;
      readonly kind: "leaf";
      readonly value: number;
    }
  | {
      readonly id: number;
      readonly depth: number;
      readonly kind: "branch";
      readonly children: readonly number[];
    };
export type MinimaxGameTreeTestCaseOutput = {
  readonly rootId: number;
  readonly nodes: readonly GeneratedGameTreeNode[];
  readonly leafCount: number;
  readonly treeJson: string;
  readonly result: AlphaBetaResult;
  readonly randomness: GeneratorReplay;
};
const nodeIdentity = {
  id: { type: "integer", minimum: 0, maximum: 1022 },
  depth: { type: "integer", minimum: 0, maximum: 8 },
} as const;
const leafSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...nodeIdentity,
    kind: { type: "string", const: "leaf" },
    value: { type: "integer" },
  },
  required: ["id", "depth", "kind", "value"],
} as const;
const branchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...nodeIdentity,
    kind: { type: "string", const: "branch" },
    children: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: { type: "integer", minimum: 0, maximum: 1022 },
    },
  },
  required: ["id", "depth", "kind", "children"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchingFactor: { type: "integer", minimum: 2, maximum: 6 },
    depth: { type: "integer", minimum: 0, maximum: 8 },
    minimumLeafValue: { type: "integer" },
    maximumLeafValue: { type: "integer" },
    maximizing: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  required: [
    "branchingFactor",
    "depth",
    "minimumLeafValue",
    "maximumLeafValue",
    "maximizing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rootId: { type: "integer", const: 0 },
    nodes: {
      type: "array",
      minItems: 1,
      maxItems: 1023,
      items: {
        type: "object",
        additionalProperties: true,
        anyOf: [leafSchema, branchSchema],
      },
    },
    leafCount: { type: "integer", minimum: 1, maximum: 512 },
    treeJson: {
      type: "string",
      minLength: 1,
      maxLength: 65536,
      format: "application/json",
    },
    result: {
      type: "object",
      additionalProperties: false,
      properties: {
        bestValue: { type: "integer" },
        evaluatedLeaves: { type: "integer", minimum: 1, maximum: 512 },
        prunedBranches: { type: "integer", minimum: 0, maximum: 1022 },
      },
      required: ["bestValue", "evaluatedLeaves", "prunedBranches"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "rootId",
    "nodes",
    "leafCount",
    "treeJson",
    "result",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MinimaxGameTreeTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateMinimaxGameTreeTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MinimaxGameTreeTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumLeafValue > input.maximumLeafValue)
      simpleError(
        "maximumLeafValue",
        "Leaf utility bounds must be ordered.",
        "invalid_utility_range",
      );
    const leafCount = input.branchingFactor ** input.depth;
    if (leafCount > 512)
      simpleError(
        "depth",
        "A complete generated tree is limited to 512 leaves.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      nodes: GeneratedGameTreeNode[] = [];
    let nextId = 0;
    const build = (depth: number): { id: number; tree: GameTree } => {
      const id = nextId++;
      if (depth === input.depth) {
        const value = random.integer(
          input.minimumLeafValue,
          input.maximumLeafValue,
        );
        nodes.push({ id, depth, kind: "leaf", value });
        return { id, tree: { value } };
      }
      const children = Array.from({ length: input.branchingFactor }, () =>
        build(depth + 1),
      );
      nodes.push({
        id,
        depth,
        kind: "branch",
        children: children.map((child) => child.id),
      });
      return { id, tree: { children: children.map((child) => child.tree) } };
    };
    const root = build(0),
      result = alphaBetaSearch(root.tree, input.maximizing);
    if (result === null)
      throw new Error(
        "A bounded generated game tree was rejected by the alpha–beta core.",
      );
    return toolSuccess({
      rootId: root.id,
      nodes: nodes.sort((a, b) => a.id - b.id),
      leafCount,
      treeJson: JSON.stringify(root.tree),
      result,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const minimaxGameTreeTestCaseExample = {
  input: {
    branchingFactor: 2,
    depth: 2,
    minimumLeafValue: 0,
    maximumLeafValue: 9,
    maximizing: false,
    seed: 42,
  },
  output: {
    rootId: 0,
    nodes: [
      {
        id: 0,
        depth: 0,
        kind: "branch",
        children: [1, 4],
      },
      {
        id: 1,
        depth: 1,
        kind: "branch",
        children: [2, 3],
      },
      {
        id: 2,
        depth: 2,
        kind: "leaf",
        value: 6,
      },
      {
        id: 3,
        depth: 2,
        kind: "leaf",
        value: 4,
      },
      {
        id: 4,
        depth: 1,
        kind: "branch",
        children: [5, 6],
      },
      {
        id: 5,
        depth: 2,
        kind: "leaf",
        value: 8,
      },
      {
        id: 6,
        depth: 2,
        kind: "leaf",
        value: 6,
      },
    ],
    leafCount: 4,
    treeJson:
      '{"children":[{"children":[{"value":6},{"value":4}]},{"children":[{"value":8},{"value":6}]}]}',
    result: {
      bestValue: 6,
      evaluatedLeaves: 3,
      prunedBranches: 1,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MinimaxGameTreeTestCaseInput,
  MinimaxGameTreeTestCaseOutput
>;
export const minimaxGameTreeTestCaseTool = createModelDefinition<
  MinimaxGameTreeTestCaseInput,
  MinimaxGameTreeTestCaseOutput
>({
  id: "random/minimax-game-tree-test-case",
  title: "Random Minimax Game Tree Test Case Generator",
  description:
    "Generate a bounded complete fixed-branching game tree with seeded integer leaf utilities, retain preorder node IDs and portable tree JSON, and delegate alternating minimax alpha–beta evaluation; pruning counts are skipped immediate child branches, not skipped leaves or a game-playing guarantee.",
  inputSchema,
  outputSchema,
  execute: calculateMinimaxGameTreeTestCase,
});
export const runMinimaxGameTreeTestCase = minimaxGameTreeTestCaseTool.execute;
export default minimaxGameTreeTestCaseTool;
