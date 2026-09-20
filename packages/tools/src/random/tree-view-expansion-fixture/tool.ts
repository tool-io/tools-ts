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
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";

export type Input = {
  readonly labels: readonly string[];
  readonly nodeCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly nodes: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly label: string;
    readonly expanded: boolean;
    readonly selected: boolean;
    readonly lazy: boolean;
    readonly placeholderId: string | null;
    readonly visible: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  { labels: list(label), nodeCount: integer(1, 32), seed: generatorSeedSchema },
  ["labels", "nodeCount"],
);
export const outputSchema = object({
  nodes: list(
    object({
      id,
      parentId: nullable(id),
      label,
      expanded: bool,
      selected: bool,
      lazy: bool,
      placeholderId: nullable(id),
      visible: bool,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateTreeViewExpansionFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      nodes: {
        id: string;
        parentId: string | null;
        label: string;
        expanded: boolean;
        selected: boolean;
        lazy: boolean;
        placeholderId: string | null;
        visible: boolean;
        depth: number;
      }[] = [];
    for (let i = 0; i < input.nodeCount; i++) {
      const parent =
          i === 0
            ? null
            : choose(
                nodes.filter((n) => n.depth < 8),
                random,
              ),
        label = preview(choose(input.labels, random), 128),
        expanded = random.unit() < 0.5,
        lazy = random.unit() < 0.25;
      nodes.push({
        id: "node-" + i,
        parentId: parent?.id ?? null,
        label,
        expanded,
        selected: false,
        lazy,
        placeholderId: null,
        visible: parent === null || (parent.visible && parent.expanded),
        depth: parent === null ? 0 : parent.depth + 1,
      });
    }
    choose(nodes, random).selected = true;
    for (const node of nodes) {
      node.lazy = node.lazy && !nodes.some((n) => n.parentId === node.id);
      node.placeholderId = node.lazy ? "loading-" + node.id : null;
    }
    return toolSuccess(
      finish({
        nodes: nodes.map(({ depth, ...node }) => node),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const treeViewExpansionFixtureExample = {
  input: { labels: ["Node"], nodeCount: 2, seed: 42 },
  output: {
    nodes: [
      {
        id: "node-0",
        parentId: null,
        label: "Node",
        expanded: true,
        selected: false,
        lazy: false,
        placeholderId: null,
        visible: true,
      },
      {
        id: "node-1",
        parentId: "node-0",
        label: "Node",
        expanded: false,
        selected: true,
        lazy: false,
        placeholderId: null,
        visible: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const treeViewExpansionFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/tree-view-expansion-fixture",
  title: "Random Tree View Expansion Fixture Generator",
  description:
    "Construct a bounded item tree with unique IDs, repeated caller labels, leaf-only lazy placeholders, one selection and visibility derived from ancestor expansion.",
  inputSchema,
  outputSchema,
  execute: calculateTreeViewExpansionFixture,
});
export const runTreeViewExpansionFixture = treeViewExpansionFixtureTool.execute;
export default treeViewExpansionFixtureTool;
