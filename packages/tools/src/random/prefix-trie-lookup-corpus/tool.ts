import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateWordFrequency } from "../../text/word-frequency/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  booleanSchema,
  nullableSchema,
} from "../m500b-csv-algorithms-schemas.js";

type TrieNode = {
  readonly id: number;
  readonly parent: number | null;
  readonly character: string;
  readonly terminal: boolean;
};
export type PrefixTrieLookupCorpusInput = {
  readonly words: readonly string[];
  readonly queryCount: number;
  readonly seed?: number;
};
export type PrefixTrieLookupCorpusOutput = {
  readonly nodes: readonly TrieNode[];
  readonly wordCounts: readonly {
    readonly word: string;
    readonly count: number;
  }[];
  readonly queries: readonly {
    readonly prefix: string;
    readonly visitedIds: readonly number[];
    readonly found: boolean;
    readonly matches: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const wordSchema = {
  type: "string",
  minLength: 1,
  maxLength: 16,
  pattern: "^[a-z]+(?![\\s\\S])",
} as const;
export const inputSchema = objectSchema(
  {
    words: arraySchema(wordSchema, 16, 1),
    queryCount: countSchema(16, 1),
    seed: generatorSeedSchema,
  },
  ["words", "queryCount"],
);
export const outputSchema = objectSchema({
  nodes: arraySchema(
    objectSchema({
      id: countSchema(256),
      parent: nullableSchema(countSchema(256)),
      character: { type: "string", maxLength: 1 },
      terminal: booleanSchema,
    }),
    257,
  ),
  wordCounts: arraySchema(
    objectSchema({ word: wordSchema, count: countSchema(16, 1) }),
    16,
  ),
  queries: arraySchema(
    objectSchema({
      prefix: { type: "string", maxLength: 17 },
      visitedIds: arraySchema(countSchema(256), 17),
      found: booleanSchema,
      matches: arraySchema(wordSchema, 16),
    }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is PrefixTrieLookupCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculatePrefixTrieLookupCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PrefixTrieLookupCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const nodes: {
      id: number;
      parent: number | null;
      character: string;
      terminal: boolean;
      prefix: string;
      children: Map<string, number>;
    }[] = [
      {
        id: 0,
        parent: null,
        character: "",
        terminal: false,
        prefix: "",
        children: new Map(),
      },
    ];
    const nodeAt = (id: number) => {
      const node = nodes[id];
      if (!node) throw new Error("Missing constructed trie node.");
      return node;
    };
    for (const word of input.words) {
      let cursor = 0;
      for (const character of word) {
        const parent = nodeAt(cursor);
        let child = parent.children.get(character);
        if (child === undefined) {
          child = nodes.length;
          parent.children.set(character, child);
          nodes.push({
            id: child,
            parent: cursor,
            character,
            terminal: false,
            prefix: parent.prefix + character,
            children: new Map(),
          });
        }
        cursor = child;
      }
      nodeAt(cursor).terminal = true;
    }
    const frequencies = calculateWordFrequency({
      text: input.words.join(" "),
      caseSensitive: true,
    }).frequencies;
    const wordCounts = [...new Set(input.words)].map((word) => {
      const count = frequencies[word];
      if (typeof count !== "number" || !Number.isSafeInteger(count))
        throw new Error("Word frequency count missing.");
      return { word, count };
    });
    const random = createGeneratorRandom(input.seed, context),
      queries = Array.from({ length: input.queryCount }, () => {
        const word = random.pick(input.words),
          length = random.integer(0, word.length + 1),
          prefix = length > word.length ? word + "#" : word.slice(0, length),
          visitedIds = [0];
        let cursor = 0,
          found = true;
        for (const character of prefix) {
          const child = nodeAt(cursor).children.get(character);
          if (child === undefined) {
            found = false;
            break;
          }
          cursor = child;
          visitedIds.push(cursor);
        }
        const matches: string[] = [];
        if (found) {
          const pending = [cursor];
          while (pending.length > 0) {
            const id = pending.pop();
            if (id === undefined)
              throw new Error("Trie traversal lost a node.");
            const node = nodeAt(id);
            if (node.terminal) matches.push(node.prefix);
            pending.push(...node.children.values());
          }
          matches.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        }
        return { prefix, visitedIds, found, matches };
      });
    return toolSuccess({
      nodes: nodes.map(({ id, parent, character, terminal }) => ({
        id,
        parent,
        character,
        terminal,
      })),
      wordCounts,
      queries,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const prefixTrieLookupCorpusExample = {
  input: { words: ["car", "cat"], queryCount: 2, seed: 42 },
  output: {
    nodes: [
      { id: 0, parent: null, character: "", terminal: false },
      { id: 1, parent: 0, character: "c", terminal: false },
      { id: 2, parent: 1, character: "a", terminal: false },
      { id: 3, parent: 2, character: "r", terminal: true },
      { id: 4, parent: 2, character: "t", terminal: true },
    ],
    wordCounts: [
      { word: "car", count: 1 },
      { word: "cat", count: 1 },
    ],
    queries: [
      {
        prefix: "ca",
        visitedIds: [0, 1, 2],
        found: true,
        matches: ["car", "cat"],
      },
      {
        prefix: "cat",
        visitedIds: [0, 1, 2, 4],
        found: true,
        matches: ["cat"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PrefixTrieLookupCorpusInput,
  PrefixTrieLookupCorpusOutput
>;
export const prefixTrieLookupCorpusTool = createModelDefinition<
  PrefixTrieLookupCorpusInput,
  PrefixTrieLookupCorpusOutput
>({
  id: "random/prefix-trie-lookup-corpus",
  title: "Random Prefix Trie Lookup Corpus Generator",
  description:
    "Build a literal prefix trie from supplied lowercase ASCII words and generate prefix queries with traversal paths, exact descendant matches, duplicate word counts and possible missing-edge controls.",
  inputSchema,
  outputSchema,
  execute: calculatePrefixTrieLookupCorpus,
});
export const runPrefixTrieLookupCorpus = prefixTrieLookupCorpusTool.execute;
export default prefixTrieLookupCorpusTool;
