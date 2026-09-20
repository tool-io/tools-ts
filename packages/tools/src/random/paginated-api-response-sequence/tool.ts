import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateQueryString } from "../../format/query-string/tool.js";
import { calculateLinkHeaderParser } from "../../http/link-header-parser/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksText,
  mocksInteger,
  mocksBoolean,
  mocksProbability,
  mocksNullable,
  mocksOrdered,
  mocksDistinct,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type PaginationRecord = { readonly id: string; readonly value: string };
export type PaginatedApiResponseSequenceInput = {
  readonly records: readonly PaginationRecord[];
  readonly minimumPageSize: number;
  readonly maximumPageSize: number;
  readonly emptyPageProbability: number;
  readonly terminalEmptyPage: boolean;
  readonly seed?: number;
};
export type PaginatedApiResponseSequenceOutput = {
  readonly pages: readonly {
    readonly cursor: string;
    readonly records: readonly PaginationRecord[];
    readonly nextCursor: string | null;
    readonly linkHeader: string;
    readonly parsedLinkTargets: readonly string[];
  }[];
  readonly recordOrder: readonly string[];
  readonly randomness: GeneratorReplay;
};
const recordSchema = mocksObject({ id: mocksLabel, value: mocksText });
export const inputSchema = mocksObject(
  {
    records: mocksArray(recordSchema),
    minimumPageSize: { type: "integer", minimum: 1, maximum: 128 },
    maximumPageSize: { type: "integer", minimum: 1, maximum: 128 },
    emptyPageProbability: mocksProbability,
    terminalEmptyPage: mocksBoolean,
    seed: generatorSeedSchema,
  },
  [
    "records",
    "minimumPageSize",
    "maximumPageSize",
    "emptyPageProbability",
    "terminalEmptyPage",
  ],
);
export const outputSchema = mocksObject({
  pages: mocksArray(
    mocksObject({
      cursor: mocksLabel,
      records: mocksArray(recordSchema),
      nextCursor: mocksNullable(mocksLabel),
      linkHeader: mocksText,
      parsedLinkTargets: mocksArray(mocksText, 1),
    }),
    128,
    1,
  ),
  recordOrder: mocksArray(mocksLabel),
  randomness: generatorReplaySchema,
});
const generate = (
  input: PaginatedApiResponseSequenceInput,
  random: GeneratorRandom,
): Omit<PaginatedApiResponseSequenceOutput, "randomness"> => {
  mocksOrdered(input.minimumPageSize, input.maximumPageSize, "maximumPageSize");
  mocksDistinct(
    input.records.map((record) => record.id),
    "records",
  );
  const records = random.shuffle(input.records),
    chunks: PaginationRecord[][] = [];
  for (let offset = 0; offset < records.length;) {
    const size = random.integer(input.minimumPageSize, input.maximumPageSize);
    chunks.push(
      records.slice(offset, offset + size).map((record) => ({ ...record })),
    );
    offset += size;
    if (offset < records.length && random.unit() < input.emptyPageProbability)
      chunks.push([]);
  }
  if (!chunks.length || input.terminalEmptyPage) chunks.push([]);
  if (chunks.length > 128)
    simpleError(
      "records",
      "The generated sequence exceeds 128 pages.",
      "resource_limit_exceeded",
    );
  const pages = chunks.map((chunk, i) => {
    const cursor = "page-" + (i + 1),
      nextCursor = i + 1 < chunks.length ? "page-" + (i + 2) : null;
    const url =
      nextCursor === null
        ? ""
        : "/items?" +
          calculateQueryString({
            params: { cursor: nextCursor, limit: input.maximumPageSize },
          }).queryString;
    const linkHeader = url ? "<" + url + '>; rel="next"' : "";
    const links = mocksCore(
      calculateLinkHeaderParser({ header: linkHeader }),
      "records",
    ).links;
    if (
      links.some(
        (link) =>
          link.parameters.length !== 1 ||
          link.parameters[0].name !== "rel" ||
          link.parameters[0].value !== "next",
      )
    )
      throw new Error("Generated next link failed relation parsing.");
    return {
      cursor,
      records: chunk,
      nextCursor,
      linkHeader,
      parsedLinkTargets: links.map((link) => link.target),
    };
  });
  return { pages, recordOrder: records.map((record) => record.id) };
};
export const paginatedApiResponseSequenceExample = {
  input: {
    records: [
      { id: "a", value: "alpha" },
      { id: "b", value: "beta" },
      { id: "c", value: "gamma" },
    ],
    minimumPageSize: 1,
    maximumPageSize: 2,
    emptyPageProbability: 0.5,
    terminalEmptyPage: true,
    seed: 42,
  },
  output: {
    pages: [
      {
        cursor: "page-1",
        records: [
          { id: "c", value: "gamma" },
          { id: "a", value: "alpha" },
        ],
        nextCursor: "page-2",
        linkHeader: '</items?cursor=page-2&limit=2>; rel="next"',
        parsedLinkTargets: ["/items?cursor=page-2&limit=2"],
      },
      {
        cursor: "page-2",
        records: [{ id: "b", value: "beta" }],
        nextCursor: "page-3",
        linkHeader: '</items?cursor=page-3&limit=2>; rel="next"',
        parsedLinkTargets: ["/items?cursor=page-3&limit=2"],
      },
      {
        cursor: "page-3",
        records: [],
        nextCursor: null,
        linkHeader: "",
        parsedLinkTargets: [],
      },
    ],
    recordOrder: ["c", "a", "b"],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  PaginatedApiResponseSequenceInput,
  PaginatedApiResponseSequenceOutput
>;

const isInput = (input: unknown): input is PaginatedApiResponseSequenceInput =>
  matchesModelInput(input, inputSchema);
export const calculatePaginatedApiResponseSequence = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PaginatedApiResponseSequenceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const paginatedApiResponseSequenceTool = createModelDefinition<
  PaginatedApiResponseSequenceInput,
  PaginatedApiResponseSequenceOutput
>({
  id: "random/paginated-api-response-sequence",
  title: "Random Paginated API Response Sequence Generator",
  description:
    "Partition shuffled supplied records into synthetic cursor pages, optional empty pages, and parser-checked next links with consistent termination.",
  inputSchema,
  outputSchema,
  execute: calculatePaginatedApiResponseSequence,
});
export const runPaginatedApiResponseSequence =
  paginatedApiResponseSequenceTool.execute;
export default paginatedApiResponseSequenceTool;
