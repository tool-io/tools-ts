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
  readonly minimumItems: number;
  readonly maximumItems: number;
  readonly pageSize: number;
  readonly count: number;
  readonly pageLabels: readonly string[];
  readonly seed?: number;
};
export type Output = {
  readonly states: readonly {
    readonly totalItems: number;
    readonly pageCount: number;
    readonly currentPage: number;
    readonly previousDisabled: boolean;
    readonly nextDisabled: boolean;
    readonly firstItem: number;
    readonly lastItem: number;
    readonly label: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    minimumItems: integer(),
    maximumItems: integer(),
    pageSize: integer(1),
    count: integer(1, 32),
    pageLabels: list(label),
    seed: generatorSeedSchema,
  },
  ["minimumItems", "maximumItems", "pageSize", "count", "pageLabels"],
);
export const outputSchema = object({
  states: list(
    object({
      totalItems: integer(),
      pageCount: integer(),
      currentPage: integer(),
      previousDisabled: bool,
      nextDisabled: bool,
      firstItem: integer(),
      lastItem: integer(),
      label: text,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculatePaginationControlStateFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumItems > input.maximumItems)
      return simpleError(
        "maximumItems",
        "Item-count bounds must be ordered.",
        "invalid_item_range",
      );
    if (
      BigInt(input.maximumItems) - BigInt(input.minimumItems) + 1n >
      BigInt(Number.MAX_SAFE_INTEGER)
    )
      return simpleError(
        "maximumItems",
        "The inclusive sampling range must fit the integer sampler.",
        "unsafe_sampling_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      states = Array.from({ length: input.count }, () => {
        const totalItems = random.integer(
            input.minimumItems,
            input.maximumItems,
          ),
          total = BigInt(totalItems),
          size = BigInt(input.pageSize),
          pageCount = Number((total + size - 1n) / size),
          currentPage = pageCount === 0 ? 0 : random.integer(1, pageCount),
          pageLabel = choose(input.pageLabels, random),
          start =
            currentPage === 0 ? 0n : (BigInt(currentPage) - 1n) * size + 1n,
          end = BigInt(currentPage) * size;
        return {
          totalItems: totalItems === 0 ? 0 : totalItems,
          pageCount,
          currentPage,
          previousDisabled: currentPage <= 1,
          nextDisabled: currentPage === 0 || currentPage === pageCount,
          firstItem: Number(start),
          lastItem: Number(end < total ? end : total),
          label: preview(pageLabel, 64) + " " + currentPage + "/" + pageCount,
        };
      });
    return toolSuccess(
      finish({ states, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const paginationControlStateFixtureExample = {
  input: {
    minimumItems: 9,
    maximumItems: 9,
    pageSize: 4,
    count: 1,
    pageLabels: ["Page"],
    seed: 42,
  },
  output: {
    states: [
      {
        totalItems: 9,
        pageCount: 3,
        currentPage: 2,
        previousDisabled: false,
        nextDisabled: false,
        firstItem: 5,
        lastItem: 8,
        label: "Page 2/3",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const paginationControlStateFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/pagination-control-state-fixture",
  title: "Random Pagination Control State Fixture Generator",
  description:
    "Generate legal pagination control states and disabled-button/item-range expectations, using page zero for empty collections and no API record bodies.",
  inputSchema,
  outputSchema,
  execute: calculatePaginationControlStateFixture,
});
export const runPaginationControlStateFixture =
  paginationControlStateFixtureTool.execute;
export default paginationControlStateFixtureTool;
