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
import { calculate as truncate } from "../../text/truncate/tool.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksText,
  mocksInteger,
  mocksBoolean,
  mocksPick,
  mocksTimestamp,
  mocksDistinct,
  mocksOrdered,
  mocksSafe,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type NewsFeedMockDatasetInput = {
  readonly templates: readonly {
    readonly title: string;
    readonly body: string;
  }[];
  readonly authorIds: readonly string[];
  readonly count: number;
  readonly startMilliseconds: number;
  readonly endMilliseconds: number;
  readonly excerptCodePoints: number;
  readonly suffix: string;
  readonly seed?: number;
};
export type NewsFeedMockDatasetOutput = {
  readonly posts: readonly {
    readonly id: string;
    readonly title: string;
    readonly body: string;
    readonly authorId: string;
    readonly timestampMilliseconds: number;
    readonly excerpt: string;
    readonly wasTruncated: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    templates: mocksArray(
      mocksObject({ title: mocksLabel, body: mocksText }),
      128,
      1,
    ),
    authorIds: mocksArray(mocksLabel, 128, 1),
    count: { type: "integer", minimum: 1, maximum: 128 },
    startMilliseconds: mocksInteger,
    endMilliseconds: mocksInteger,
    excerptCodePoints: { type: "integer", minimum: 0, maximum: 4096 },
    suffix: { type: "string", maxLength: 128 },
    seed: generatorSeedSchema,
  },
  [
    "templates",
    "authorIds",
    "count",
    "startMilliseconds",
    "endMilliseconds",
    "excerptCodePoints",
    "suffix",
  ],
);
export const outputSchema = mocksObject({
  posts: mocksArray(
    mocksObject({
      id: mocksLabel,
      title: mocksLabel,
      body: mocksText,
      authorId: mocksLabel,
      timestampMilliseconds: mocksInteger,
      excerpt: mocksText,
      wasTruncated: mocksBoolean,
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: NewsFeedMockDatasetInput,
  random: GeneratorRandom,
): Omit<NewsFeedMockDatasetOutput, "randomness"> => {
  mocksDistinct(input.authorIds, "authorIds");
  mocksOrdered(
    input.startMilliseconds,
    input.endMilliseconds,
    "endMilliseconds",
  );
  mocksSafe(
    input.endMilliseconds - input.startMilliseconds + 1,
    "endMilliseconds",
  );
  const templates = input.templates.map((template) => {
    const result = truncate({
      actualText: template.body,
      actualCodepointLimit: input.excerptCodePoints,
      actualSuffix: input.suffix,
    }).result;
    if (
      typeof result.truncatedText !== "string" ||
      typeof result.wasTruncated !== "boolean"
    )
      throw new Error("Truncation core returned an unexpected shape.");
    return {
      ...template,
      excerpt: result.truncatedText,
      wasTruncated: result.wasTruncated,
    };
  });
  const posts = Array.from({ length: input.count }, (_, i) => {
    const template = mocksPick(templates, random),
      authorId = mocksPick(input.authorIds, random);
    return {
      id: "post-" + (i + 1),
      ...template,
      authorId,
      timestampMilliseconds: mocksTimestamp(
        input.startMilliseconds,
        input.endMilliseconds,
        random,
      ),
    };
  }).sort((a, b) => b.timestampMilliseconds - a.timestampMilliseconds);
  return { posts };
};
export const newsFeedMockDatasetExample = {
  input: {
    templates: [
      { title: "Kite", body: "Kites drift." },
      { title: "Garden", body: "Seedlings grow." },
      { title: "Workshop", body: "A model takes shape." },
    ],
    authorIds: ["actor-a", "actor-b"],
    count: 2,
    startMilliseconds: 1000,
    endMilliseconds: 5000,
    excerptCodePoints: 9,
    suffix: "…",
    seed: 42,
  },
  output: {
    posts: [
      {
        id: "post-1",
        title: "Garden",
        body: "Seedlings grow.",
        excerpt: "Seedling…",
        wasTruncated: true,
        authorId: "actor-a",
        timestampMilliseconds: 4410,
      },
      {
        id: "post-2",
        title: "Workshop",
        body: "A model takes shape.",
        excerpt: "A model …",
        wasTruncated: true,
        authorId: "actor-a",
        timestampMilliseconds: 3106,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  NewsFeedMockDatasetInput,
  NewsFeedMockDatasetOutput
>;

const isInput = (input: unknown): input is NewsFeedMockDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateNewsFeedMockDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NewsFeedMockDatasetOutput> => {
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
export const newsFeedMockDatasetTool = createModelDefinition<
  NewsFeedMockDatasetInput,
  NewsFeedMockDatasetOutput
>({
  id: "random/news-feed-mock-dataset",
  title: "Random News Feed Mock Dataset Generator",
  description:
    "Compose supplied fictional post templates and synthetic author IDs into a chronological feed with bounded code-point excerpts and explicit Unix-millisecond bounds.",
  inputSchema,
  outputSchema,
  execute: calculateNewsFeedMockDataset,
});
export const runNewsFeedMockDataset = newsFeedMockDatasetTool.execute;
export default newsFeedMockDatasetTool;
