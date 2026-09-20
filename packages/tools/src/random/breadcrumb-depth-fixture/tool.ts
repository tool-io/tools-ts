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
  readonly minimumDepth: number;
  readonly maximumDepth: number;
  readonly labelLimit: number;
  readonly seed?: number;
};
export type Output = {
  readonly crumbs: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly label: string;
    readonly displayLabel: string;
    readonly current: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    labels: list(label),
    minimumDepth: integer(1, 32),
    maximumDepth: integer(1, 32),
    labelLimit: integer(0, 128),
    seed: generatorSeedSchema,
  },
  ["labels", "minimumDepth", "maximumDepth", "labelLimit"],
);
export const outputSchema = object({
  crumbs: list(
    object({
      id,
      parentId: nullable(id),
      label,
      displayLabel: text,
      current: bool,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateBreadcrumbDepthFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumDepth > input.maximumDepth)
      return simpleError(
        "maximumDepth",
        "Depth bounds must be ordered.",
        "invalid_depth_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      depth = random.integer(input.minimumDepth, input.maximumDepth);
    const crumbs = Array.from({ length: depth }, (_, i) => {
      const label = choose(input.labels, random);
      return {
        id: "crumb-" + i,
        parentId: i === 0 ? null : "crumb-" + (i - 1),
        label,
        displayLabel: preview(label, input.labelLimit),
        current: i === depth - 1,
      };
    });
    return toolSuccess(
      finish({ crumbs, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const breadcrumbDepthFixtureExample = {
  input: {
    labels: ["Home", "Reports"],
    minimumDepth: 2,
    maximumDepth: 3,
    labelLimit: 4,
    seed: 42,
  },
  output: {
    crumbs: [
      {
        id: "crumb-0",
        parentId: null,
        label: "Home",
        displayLabel: "Home",
        current: false,
      },
      {
        id: "crumb-1",
        parentId: "crumb-0",
        label: "Reports",
        displayLabel: "Rep…",
        current: false,
      },
      {
        id: "crumb-2",
        parentId: "crumb-1",
        label: "Reports",
        displayLabel: "Rep…",
        current: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const breadcrumbDepthFixtureTool = createModelDefinition<Input, Output>({
  id: "random/breadcrumb-depth-fixture",
  title: "Random Breadcrumb Depth Fixture Generator",
  description:
    "Construct a synthetic breadcrumb chain with bounded random depth, supplied labels, parent IDs, current location and codepoint truncation expectations.",
  inputSchema,
  outputSchema,
  execute: calculateBreadcrumbDepthFixture,
});
export const runBreadcrumbDepthFixture = breadcrumbDepthFixtureTool.execute;
export default breadcrumbDepthFixtureTool;
