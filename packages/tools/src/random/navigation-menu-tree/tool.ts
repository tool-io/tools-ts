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
  readonly maximumDepth: number;
  readonly labelLimit: number;
  readonly seed?: number;
};
export type Output = {
  readonly nodes: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly depth: number;
    readonly label: string;
    readonly displayLabel: string;
    readonly disabled: boolean;
    readonly current: boolean;
  }[];
  readonly currentPath: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    labels: list(label),
    nodeCount: integer(1, 32),
    maximumDepth: integer(1, 8),
    labelLimit: integer(0, 128),
    seed: generatorSeedSchema,
  },
  ["labels", "nodeCount", "maximumDepth", "labelLimit"],
);
export const outputSchema = object({
  nodes: list(
    object({
      id,
      parentId: nullable(id),
      depth: integer(0, 8),
      label,
      displayLabel: text,
      disabled: bool,
      current: bool,
    }),
  ),
  currentPath: list(id, 9),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateNavigationMenuTree = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const nodes: {
      id: string;
      parentId: string | null;
      depth: number;
      label: string;
      displayLabel: string;
      disabled: boolean;
      current: boolean;
    }[] = [];
    for (let i = 0; i < input.nodeCount; i++) {
      const parent =
          i === 0
            ? null
            : choose(
                nodes.filter((n) => n.depth < input.maximumDepth),
                random,
              ),
        label = choose(input.labels, random);
      nodes.push({
        id: "menu-" + i,
        parentId: parent?.id ?? null,
        depth: parent === null ? 0 : parent.depth + 1,
        label,
        displayLabel: preview(label, input.labelLimit),
        disabled: random.unit() < 0.5,
        current: false,
      });
    }
    const current = choose(nodes, random),
      currentPath: string[] = [];
    let cursor: typeof current | undefined = current;
    while (cursor) {
      const parentId: string | null = cursor.parentId;
      cursor.disabled = false;
      currentPath.unshift(cursor.id);
      cursor = nodes.find((n) => n.id === parentId);
    }
    current.current = true;
    return toolSuccess(
      finish({
        nodes,
        currentPath,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const navigationMenuTreeExample = {
  input: {
    labels: ["Home", "Docs"],
    nodeCount: 2,
    maximumDepth: 2,
    labelLimit: 8,
    seed: 42,
  },
  output: {
    nodes: [
      {
        id: "menu-0",
        parentId: null,
        depth: 0,
        label: "Docs",
        displayLabel: "Docs",
        disabled: false,
        current: false,
      },
      {
        id: "menu-1",
        parentId: "menu-0",
        depth: 1,
        label: "Docs",
        displayLabel: "Docs",
        disabled: false,
        current: true,
      },
    ],
    currentPath: ["menu-0", "menu-1"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const navigationMenuTreeTool = createModelDefinition<Input, Output>({
  id: "random/navigation-menu-tree",
  title: "Random Navigation Menu Tree Fixture Generator",
  description:
    "Build a bounded supplied-label menu tree with disabled states and one enabled current-location ancestry path; no browser interaction is modeled.",
  inputSchema,
  outputSchema,
  execute: calculateNavigationMenuTree,
});
export const runNavigationMenuTree = navigationMenuTreeTool.execute;
export default navigationMenuTreeTool;
