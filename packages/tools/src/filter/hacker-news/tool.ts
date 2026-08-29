import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export const hackerNewsStoryKinds = ["all", "ask", "show", "link"] as const;
export const hackerNewsSortKeys = ["newest", "points", "comments"] as const;

export type HackerNewsStoryKind = (typeof hackerNewsStoryKinds)[number];
export type HackerNewsSortKey = (typeof hackerNewsSortKeys)[number];

export type HackerNewsStory = {
  readonly author: string;
  readonly commentCount: number;
  readonly createdAt: string;
  readonly id: string;
  readonly points: number;
  readonly title: string;
  readonly url: string | null;
};

export type HackerNewsFilterInput = {
  readonly from?: string;
  readonly items: readonly HackerNewsStory[];
  readonly limit?: number;
  readonly minimumComments?: number;
  readonly minimumPoints?: number;
  readonly query?: string;
  readonly sortBy?: HackerNewsSortKey;
  readonly storyKind?: HackerNewsStoryKind;
  readonly to?: string;
};

export type HackerNewsFilterOutput = {
  readonly items: readonly HackerNewsStory[];
  readonly totalMatches: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const validDate = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  Number.isFinite(Date.parse(value));

type RuntimeUrlConstructor = {
  new (value: string): { readonly protocol: string };
  readonly canParse?: (value: string) => boolean;
};

const runtimeUrlConstructor = (
  globalThis as unknown as { readonly URL?: RuntimeUrlConstructor }
).URL;

const validHttpUrl = (value: string): boolean => {
  if (!runtimeUrlConstructor) return false;
  try {
    if (
      runtimeUrlConstructor.canParse &&
      !runtimeUrlConstructor.canParse(value)
    )
      return false;
    const protocol = new runtimeUrlConstructor(value).protocol;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const hackerNewsStorySchema = {
  additionalProperties: false,
  properties: {
    author: { type: "string" },
    commentCount: { minimum: 0, type: "integer" },
    createdAt: { format: "date-time", type: "string" },
    id: { minLength: 1, type: "string" },
    points: { minimum: 0, type: "integer" },
    title: { minLength: 1, type: "string" },
    url: {
      anyOf: [{ format: "uri", type: "string" }, { type: "null" }],
    },
  },
  required: [
    "author",
    "commentCount",
    "createdAt",
    "id",
    "points",
    "title",
    "url",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const validStory = (value: unknown): value is HackerNewsStory =>
  isRecord(value) &&
  typeof value.id === "string" &&
  value.id.length > 0 &&
  typeof value.title === "string" &&
  value.title.length > 0 &&
  typeof value.author === "string" &&
  validDate(value.createdAt) &&
  Number.isSafeInteger(value.points) &&
  (value.points as number) >= 0 &&
  Number.isSafeInteger(value.commentCount) &&
  (value.commentCount as number) >= 0 &&
  (value.url === null ||
    (typeof value.url === "string" && validHttpUrl(value.url)));

const storyKind = (
  story: HackerNewsStory,
): Exclude<HackerNewsStoryKind, "all"> => {
  const title = story.title.toLocaleLowerCase("en-US");
  if (title.startsWith("ask hn:")) return "ask";
  if (title.startsWith("show hn:")) return "show";
  return "link";
};

export const filterHackerNews = (
  input: unknown,
): ToolResult<HackerNewsFilterOutput> => {
  if (!isRecord(input) || !Array.isArray(input.items)) {
    return invalidInput([
      {
        code: "items_required",
        field: "items",
        message: "A list of normalized Hacker News stories is required.",
      },
    ]);
  }
  if (input.items.length > 1_000 || !input.items.every(validStory)) {
    return invalidInput([
      {
        code: "invalid_items",
        field: "items",
        message: "Stories must contain valid IDs, titles, dates, and counts.",
      },
    ]);
  }

  const query = typeof input.query === "string" ? input.query.trim() : "";
  const minimumPoints = input.minimumPoints ?? 0;
  const minimumComments = input.minimumComments ?? 0;
  const limit = input.limit ?? 30;
  const selectedKind = input.storyKind ?? "all";
  const sortBy = input.sortBy ?? "newest";
  const from = input.from;
  const to = input.to;

  if (
    query.length > 500 ||
    !Number.isSafeInteger(minimumPoints) ||
    (minimumPoints as number) < 0 ||
    !Number.isSafeInteger(minimumComments) ||
    (minimumComments as number) < 0 ||
    !Number.isSafeInteger(limit) ||
    (limit as number) < 1 ||
    (limit as number) > 100 ||
    !hackerNewsStoryKinds.includes(selectedKind as HackerNewsStoryKind) ||
    !hackerNewsSortKeys.includes(sortBy as HackerNewsSortKey) ||
    (from !== undefined && !validDate(from)) ||
    (to !== undefined && !validDate(to))
  ) {
    return invalidInput([
      {
        code: "invalid_filters",
        field: "",
        message: "One or more Hacker News filters are invalid.",
      },
    ]);
  }

  const fromTime = from === undefined ? null : Date.parse(from as string);
  const toTime = to === undefined ? null : Date.parse(to as string);
  if (fromTime !== null && toTime !== null && fromTime > toTime) {
    return invalidInput([
      {
        code: "invalid_date_range",
        field: "from",
        message: "The start date must not be after the end date.",
      },
    ]);
  }

  const terms = query.toLocaleLowerCase("en-US").split(/\s+/).filter(Boolean);
  const matches = (input.items as HackerNewsStory[])
    .filter(
      (story) =>
        story.points >= (minimumPoints as number) &&
        story.commentCount >= (minimumComments as number),
    )
    .filter(
      (story) => selectedKind === "all" || storyKind(story) === selectedKind,
    )
    .filter((story) => {
      const createdAt = Date.parse(story.createdAt);
      return (
        (fromTime === null || createdAt >= fromTime) &&
        (toTime === null || createdAt <= toTime)
      );
    })
    .filter((story) => {
      const searchable = [story.title, story.author, story.url ?? ""]
        .join("\n")
        .toLocaleLowerCase("en-US");
      return terms.every((term) => searchable.includes(term));
    })
    .sort((left, right) => {
      const primary =
        sortBy === "points"
          ? right.points - left.points
          : sortBy === "comments"
            ? right.commentCount - left.commentCount
            : Date.parse(right.createdAt) - Date.parse(left.createdAt);
      return (
        primary || right.points - left.points || right.id.localeCompare(left.id)
      );
    });

  return toolSuccess({
    items: matches.slice(0, limit as number),
    totalMatches: matches.length,
  });
};

export const example = {
  input: {
    items: [
      {
        author: "alice",
        commentCount: 42,
        createdAt: "2026-09-12T12:00:00.000Z",
        id: "2",
        points: 180,
        title: "Show HN: A reproducible model benchmark",
        url: "https://example.com/benchmark",
      },
      {
        author: "bob",
        commentCount: 12,
        createdAt: "2026-09-13T09:00:00.000Z",
        id: "3",
        points: 75,
        title: "A database release",
        url: "https://example.com/database",
      },
      {
        author: "carol",
        commentCount: 5,
        createdAt: "2026-09-11T10:00:00.000Z",
        id: "1",
        points: 40,
        title: "Ask HN: Which benchmark do you trust?",
        url: null,
      },
    ],
    minimumPoints: 100,
    query: "benchmark",
    sortBy: "points",
  },
  output: {
    items: [
      {
        author: "alice",
        commentCount: 42,
        createdAt: "2026-09-12T12:00:00.000Z",
        id: "2",
        points: 180,
        title: "Show HN: A reproducible model benchmark",
        url: "https://example.com/benchmark",
      },
    ],
    totalMatches: 1,
  },
} satisfies ToolExample<HackerNewsFilterInput, HackerNewsFilterOutput>;

export const hackerNewsFilterTool = defineTool<
  HackerNewsFilterInput,
  HackerNewsFilterOutput
>({
  contractVersion: 1,
  description:
    "Filter normalized Hacker News stories by text, story type, date, points, and comments, then rank the matches without performing network requests.",
  discovery: {
    aliases: ["HN filter", "Hacker News search", "filter HN stories"],
    collections: ["data", "developer"],
    fields: ["Hacker News", "news aggregation"],
    keywords: ["Ask HN", "Show HN", "comments", "points", "stories"],
  },
  execution: { kind: "pure" },
  id: "filter/hacker-news",
  inputSchema: {
    additionalProperties: false,
    properties: {
      from: { format: "date-time", type: "string" },
      items: {
        items: hackerNewsStorySchema,
        maxItems: 1_000,
        type: "array",
      },
      limit: { default: 30, maximum: 100, minimum: 1, type: "integer" },
      minimumComments: { default: 0, minimum: 0, type: "integer" },
      minimumPoints: { default: 0, minimum: 0, type: "integer" },
      query: { maxLength: 500, type: "string" },
      sortBy: { default: "newest", enum: hackerNewsSortKeys, type: "string" },
      storyKind: {
        default: "all",
        enum: hackerNewsStoryKinds,
        type: "string",
      },
      to: { format: "date-time", type: "string" },
    },
    required: ["items"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      items: { items: hackerNewsStorySchema, type: "array" },
      totalMatches: { minimum: 0, type: "integer" },
    },
    required: ["items", "totalMatches"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        description: "Normalized stories supplied by a consuming surface.",
        id: "items",
        label: "Hacker News stories",
        required: true,
        valueType: {
          format: "hacker-news/stories",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        description: "Stories that match the selected filters.",
        id: "items",
        label: "Matching stories",
        valueType: {
          format: "hacker-news/stories",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
  },
  title: "Hacker News Filter",
  execute: filterHackerNews,
});

export default hackerNewsFilterTool;
