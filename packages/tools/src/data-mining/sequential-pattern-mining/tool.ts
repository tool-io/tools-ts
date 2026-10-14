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
import { generatorFailure } from "../../random/generator-random.js";

export type SequentialPatternMiningInput = {
  readonly sequences: readonly (readonly string[])[];
  readonly minimumCount: number;
  readonly maximumLength: number;
};
export type SequentialPatternMiningOutput = {
  readonly sequenceCount: number;
  readonly patterns: readonly {
    readonly events: readonly string[];
    readonly count: number;
    readonly support: number;
  }[];
};
const event = { type: "string", minLength: 1, maxLength: 64 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequences: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: { type: "array", maxItems: 32, items: event },
    },
    minimumCount: { type: "integer", minimum: 1, maximum: 128 },
    maximumLength: { type: "integer", minimum: 1, maximum: 8 },
  },
  required: ["sequences", "minimumCount", "maximumLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequenceCount: { type: "integer", minimum: 1, maximum: 128 },
    patterns: {
      type: "array",
      maxItems: 4096,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          events: { type: "array", minItems: 1, maxItems: 8, items: event },
          count: { type: "integer", minimum: 1, maximum: 128 },
          support: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: ["events", "count", "support"],
      },
    },
  },
  required: ["sequenceCount", "patterns"],
} as const;

const isInput = (input: unknown): input is SequentialPatternMiningInput =>
  matchesModelInput(input, inputSchema);
export const calculateSequentialPatternMining = (
  input: unknown,
): ToolResult<SequentialPatternMiningOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.sequences.flat()).size > 16)
      simpleError(
        "sequences",
        "At most 16 event labels are supported.",
        "resource_limit",
      );
    const patterns: { events: string[]; count: number; support: number }[] = [];
    let work = 0;
    const mine = (
      prefix: readonly string[],
      projected: readonly (readonly string[])[],
    ): void => {
      const extensions = new Map<string, (readonly string[])[]>();
      for (const sequence of projected) {
        const seen = new Set<string>();
        sequence.forEach((event, i) => {
          if (++work > 200_000)
            simpleError(
              "sequences",
              "Prefix projection exceeds 200,000 examined events.",
              "resource_limit",
            );
          if (seen.has(event)) return;
          seen.add(event);
          const suffixes = extensions.get(event) ?? [];
          suffixes.push(sequence.slice(i + 1));
          extensions.set(event, suffixes);
        });
      }
      for (const [event, suffixes] of [...extensions].sort(([a], [b]) =>
        a < b ? -1 : a > b ? 1 : 0,
      )) {
        if (suffixes.length < input.minimumCount) continue;
        if (patterns.length >= 4096)
          simpleError(
            "maximumLength",
            "At most 4,096 patterns may be retained.",
            "resource_limit",
          );
        const events = [...prefix, event];
        patterns.push({
          events,
          count: suffixes.length,
          support: suffixes.length / input.sequences.length,
        });
        if (events.length < input.maximumLength) mine(events, suffixes);
      }
    };
    mine([], input.sequences);
    patterns.sort(
      (a, b) =>
        a.events.length - b.events.length ||
        (JSON.stringify(a.events) < JSON.stringify(b.events)
          ? -1
          : JSON.stringify(a.events) > JSON.stringify(b.events)
            ? 1
            : 0),
    );
    return toolSuccess({ sequenceCount: input.sequences.length, patterns });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const sequentialPatternMiningExample = {
  input: {
    sequences: [
      ["A", "B", "A"],
      ["A", "B"],
      ["B", "A"],
    ],
    minimumCount: 2,
    maximumLength: 2,
  },
  output: {
    sequenceCount: 3,
    patterns: [
      {
        events: ["A"],
        count: 3,
        support: 1,
      },
      {
        events: ["B"],
        count: 3,
        support: 1,
      },
      {
        events: ["A", "B"],
        count: 2,
        support: 0.6666666666666666,
      },
      {
        events: ["B", "A"],
        count: 2,
        support: 0.6666666666666666,
      },
    ],
  },
} satisfies ToolExample<
  SequentialPatternMiningInput,
  SequentialPatternMiningOutput
>;
export const sequentialPatternMiningTool = createModelDefinition<
  SequentialPatternMiningInput,
  SequentialPatternMiningOutput
>({
  discovery: {
    aliases: [
      "Sequential Pattern Miner",
      "Sequential Pattern Mining Tool",
      "data mining",
      "machine learning",
    ],
    collections: ["ai", "data"],
    fields: ["data-mining", "data mining", "machine learning"],
    keywords: ["data mining", "machine learning"],
  },
  id: "data-mining/sequential-pattern-mining",
  title: "Sequential Pattern Miner",
  description:
    "Mine bounded frequent ordered subsequences of single-event string sequences using prefix projection, allowing arbitrary gaps and repeated events and counting each source sequence at most once per pattern.",
  inputSchema,
  outputSchema,
  execute: calculateSequentialPatternMining,
});
export const runSequentialPatternMining = sequentialPatternMiningTool.execute;
export default sequentialPatternMiningTool;
