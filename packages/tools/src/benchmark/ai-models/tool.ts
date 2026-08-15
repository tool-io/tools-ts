import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type AiModelBenchmarkDefinition = {
  readonly dataset: string | null;
  readonly harness: string | null;
  readonly id: string;
  readonly metric: string;
  readonly name: string;
  readonly preference: "higher" | "lower" | "unknown";
  readonly variant: string | null;
  readonly version: string | null;
};

export type AiModelBenchmarkScore = {
  readonly benchmarkId: string;
  readonly citations: readonly {
    readonly name: string;
    readonly url: string;
  }[];
  readonly date: string | null;
  readonly datasets: readonly string[];
  readonly evaluationVariant: string | null;
  readonly harness: string | null;
  readonly id: string;
  readonly modelVariant: string | null;
  readonly score: number;
  readonly tasks: readonly string[];
  readonly verified: boolean | null;
};

export type AiModelProviderOffer = {
  readonly inputUsdPerMillion: number | null;
  readonly outputUsdPerMillion: number | null;
  readonly providerId: string;
  readonly providerModelId: string;
  readonly providerName: string;
};

export type AiModelRecord = {
  readonly description: string;
  readonly family: string | null;
  readonly id: string;
  readonly lastUpdated: string | null;
  readonly limits: {
    readonly context: number | null;
    readonly output: number | null;
  };
  readonly name: string;
  readonly offers: readonly AiModelProviderOffer[];
  readonly openWeights: boolean;
  readonly releaseDate: string | null;
  readonly scores: readonly AiModelBenchmarkScore[];
};

export type AiModelBenchmarkDataset = {
  readonly benchmarks: readonly AiModelBenchmarkDefinition[];
  readonly models: readonly AiModelRecord[];
  readonly schemaVersion: 1;
};

export const aiModelSortKeys = [
  "name",
  "benchmark-score",
  "available-scores",
  "input-cost",
  "output-cost",
  "context",
  "release-date",
] as const;

export type AiModelSortKey = (typeof aiModelSortKeys)[number];
export type AiModelBenchmarkInput = {
  readonly benchmarkId?: string;
  readonly data: AiModelBenchmarkDataset;
  readonly direction?: "ascending" | "descending";
  readonly openWeightsOnly?: boolean;
  readonly query?: string;
  readonly sortBy?: AiModelSortKey;
};

export type RankedAiModel = {
  readonly availableScoreCount: number;
  readonly benchmarkScore: AiModelBenchmarkScore | null;
  readonly contextTokens: number | null;
  readonly description: string;
  readonly family: string | null;
  readonly id: string;
  readonly lowestInputUsdPerMillion: number | null;
  readonly lowestOutputUsdPerMillion: number | null;
  readonly modelId: string;
  readonly modelVariant: string | null;
  readonly name: string;
  readonly openWeights: boolean;
  readonly releaseDate: string | null;
};

export type AiModelBenchmarkOutput = {
  readonly benchmark: AiModelBenchmarkDefinition | null;
  readonly rows: readonly RankedAiModel[];
  readonly totalModels: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const lowestPrice = (
  offers: readonly AiModelProviderOffer[],
  key: "inputUsdPerMillion" | "outputUsdPerMillion",
): number | null => {
  const prices = offers
    .map((offer) => offer[key])
    .filter(
      (price): price is number =>
        typeof price === "number" && Number.isFinite(price) && price >= 0,
    );
  return prices.length === 0 ? null : Math.min(...prices);
};

const compareNullableNumber = (
  left: number | null,
  right: number | null,
): number => {
  if (left === null) return right === null ? 0 : 1;
  if (right === null) return -1;
  return left - right;
};

const compareNullableDate = (
  left: string | null,
  right: string | null,
): number => {
  if (left === null) return right === null ? 0 : 1;
  if (right === null) return -1;
  return left.localeCompare(right, "en-US");
};

export const rankAiModels = (
  input: unknown,
): ToolResult<AiModelBenchmarkOutput> => {
  if (!isRecord(input) || !isRecord(input.data)) {
    return invalidInput([
      {
        code: "dataset_required",
        field: "data",
        message: "An AI model benchmark dataset is required.",
      },
    ]);
  }

  const data = input.data as unknown as AiModelBenchmarkDataset;
  if (
    data.schemaVersion !== 1 ||
    !Array.isArray(data.models) ||
    !Array.isArray(data.benchmarks)
  ) {
    return invalidInput([
      {
        code: "unsupported_dataset",
        field: "data",
        message: "The AI model benchmark dataset is not supported.",
      },
    ]);
  }

  const sortByCandidate = input.sortBy ?? "available-scores";
  const directionCandidate = input.direction ?? "descending";
  const query = typeof input.query === "string" ? input.query.trim() : "";
  const openWeightsOnly = input.openWeightsOnly ?? false;
  const benchmarkId =
    typeof input.benchmarkId === "string" && input.benchmarkId.length > 0
      ? input.benchmarkId
      : undefined;

  if (
    !aiModelSortKeys.includes(sortByCandidate as AiModelSortKey) ||
    !["ascending", "descending"].includes(directionCandidate as string) ||
    typeof openWeightsOnly !== "boolean"
  ) {
    return invalidInput([
      {
        code: "invalid_options",
        field: "sortBy",
        message: "Sort, direction, and filter options must be valid.",
      },
    ]);
  }
  const sortBy = sortByCandidate as AiModelSortKey;
  const direction = directionCandidate as "ascending" | "descending";

  const benchmark = benchmarkId
    ? (data.benchmarks.find(({ id }) => id === benchmarkId) ?? null)
    : null;
  if (benchmarkId && !benchmark) {
    return invalidInput([
      {
        code: "unknown_benchmark",
        field: "benchmarkId",
        message: "The selected benchmark is not in the dataset.",
      },
    ]);
  }

  const normalizedQuery = query.toLocaleLowerCase("en-US");
  const rows = data.models
    .filter((model) => !openWeightsOnly || model.openWeights)
    .filter(
      (model) =>
        normalizedQuery.length === 0 ||
        [model.id, model.name, model.family ?? "", model.description].some(
          (value) => value.toLocaleLowerCase("en-US").includes(normalizedQuery),
        ),
    )
    .flatMap((model): RankedAiModel[] => {
      const matchingScores = benchmarkId
        ? model.scores.filter(
            (score: AiModelBenchmarkScore) => score.benchmarkId === benchmarkId,
          )
        : [];
      const observations: readonly (AiModelBenchmarkScore | null)[] =
        matchingScores.length > 0 ? matchingScores : [null];
      const availableScoreCount = new Set(
        model.scores.map((score: AiModelBenchmarkScore) => score.benchmarkId),
      ).size;

      return observations.map((benchmarkScore) => ({
        availableScoreCount,
        benchmarkScore,
        contextTokens: model.limits.context,
        description: model.description,
        family: model.family,
        id: benchmarkScore?.id ?? `${model.id}#unscored`,
        lowestInputUsdPerMillion: lowestPrice(
          model.offers,
          "inputUsdPerMillion",
        ),
        lowestOutputUsdPerMillion: lowestPrice(
          model.offers,
          "outputUsdPerMillion",
        ),
        modelId: model.id,
        modelVariant: benchmarkScore?.modelVariant ?? null,
        name: model.name,
        openWeights: model.openWeights,
        releaseDate: model.releaseDate,
      }));
    });

  const compare = (left: RankedAiModel, right: RankedAiModel): number => {
    switch (sortBy) {
      case "name":
        return left.name.localeCompare(right.name, "en-US");
      case "benchmark-score":
        return compareNullableNumber(
          left.benchmarkScore?.score ?? null,
          right.benchmarkScore?.score ?? null,
        );
      case "available-scores":
        return left.availableScoreCount - right.availableScoreCount;
      case "input-cost":
        return compareNullableNumber(
          left.lowestInputUsdPerMillion,
          right.lowestInputUsdPerMillion,
        );
      case "output-cost":
        return compareNullableNumber(
          left.lowestOutputUsdPerMillion,
          right.lowestOutputUsdPerMillion,
        );
      case "context":
        return compareNullableNumber(left.contextTokens, right.contextTokens);
      case "release-date":
        return compareNullableDate(left.releaseDate, right.releaseDate);
    }
  };

  const missingSortValue = (row: RankedAiModel): boolean => {
    switch (sortBy) {
      case "benchmark-score":
        return row.benchmarkScore === null;
      case "input-cost":
        return row.lowestInputUsdPerMillion === null;
      case "output-cost":
        return row.lowestOutputUsdPerMillion === null;
      case "context":
        return row.contextTokens === null;
      case "release-date":
        return row.releaseDate === null;
      default:
        return false;
    }
  };

  rows.sort((left, right) => {
    const leftMissing = missingSortValue(left);
    const rightMissing = missingSortValue(right);
    if (leftMissing !== rightMissing) return leftMissing ? 1 : -1;
    const compared = compare(left, right);
    if (compared === 0)
      return (
        left.name.localeCompare(right.name, "en-US") ||
        left.id.localeCompare(right.id, "en-US")
      );
    return direction === "ascending" ? compared : -compared;
  });

  return toolSuccess({ benchmark, rows, totalModels: data.models.length });
};

export const aiModelBenchmarkTool = defineTool<
  AiModelBenchmarkInput,
  AiModelBenchmarkOutput
>({
  contractVersion: 1,
  description:
    "Filter and rank source-linked AI model benchmark and provider data.",
  discovery: {
    aliases: ["AI benchmark", "LLM benchmark", "model ranking"],
    collections: ["ai"],
    fields: ["artificial intelligence", "machine learning"],
    keywords: ["benchmark", "cost", "LLM", "model", "ranking"],
  },
  execute: rankAiModels,
  execution: {
    datasets: [{ id: "benchmark/ai-models", schemaVersion: 1 }],
    kind: "data",
  },
  id: "benchmark/ai-models",
  inputSchema: {
    additionalProperties: false,
    properties: {
      benchmarkId: { type: "string" },
      data: { additionalProperties: true, type: "object" },
      direction: { enum: ["ascending", "descending"], type: "string" },
      openWeightsOnly: { default: false, type: "boolean" },
      query: { type: "string" },
      sortBy: { enum: aiModelSortKeys, type: "string" },
    },
    required: ["data"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      benchmark: {
        anyOf: [
          { additionalProperties: true, type: "object" },
          { type: "null" },
        ],
      },
      rows: {
        items: { additionalProperties: true, type: "object" },
        type: "array",
      },
      totalModels: { minimum: 0, type: "integer" },
    },
    required: ["benchmark", "rows", "totalModels"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "data",
        label: "AI model benchmark data",
        required: true,
        valueType: { format: "toolio.ai-model-benchmark.v1", type: "object" },
      },
    ],
    outputs: [
      {
        id: "rows",
        label: "Ranked AI models",
        path: ["rows"],
        valueType: {
          format: "toolio.ranked-ai-model.v1",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
  },
  title: "AI Model Benchmarks",
});

export const example = {
  input: {
    data: {
      benchmarks: [],
      models: [
        {
          description: "Example model used to demonstrate the ranking output.",
          family: "example",
          id: "example/model",
          lastUpdated: "2026-08-01",
          limits: { context: 1000, output: 100 },
          name: "Example Model",
          offers: [],
          openWeights: true,
          releaseDate: "2026-08-01",
          scores: [],
        },
      ],
      schemaVersion: 1,
    },
  },
  output: {
    benchmark: null,
    rows: [
      {
        availableScoreCount: 0,
        benchmarkScore: null,
        contextTokens: 1000,
        description: "Example model used to demonstrate the ranking output.",
        family: "example",
        id: "example/model#unscored",
        lowestInputUsdPerMillion: null,
        lowestOutputUsdPerMillion: null,
        modelId: "example/model",
        modelVariant: null,
        name: "Example Model",
        openWeights: true,
        releaseDate: "2026-08-01",
      },
    ],
    totalModels: 1,
  },
} satisfies ToolExample<AiModelBenchmarkInput, AiModelBenchmarkOutput>;

export default aiModelBenchmarkTool;
