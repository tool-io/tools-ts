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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateLevenshtein } from "../../distance/levenshtein/tool.js";
import { calculateDamerauLevenshtein } from "../../distance/damerau-levenshtein/tool.js";
import { matrixAsJson } from "../../matrix/as-json/tool.js";

export type StringDistanceMatrixInput = {
  readonly sourceTexts: readonly string[];
  readonly alphabet: readonly string[];
  readonly count: number;
  readonly maximumMutations: number;
  readonly seed?: number;
};
export type StringMutationRecord = {
  readonly kind: "insert" | "delete" | "substitute" | "transpose";
  readonly index: number;
  readonly before: string;
  readonly after: string;
};
export type StringDistanceMatrixOutput = {
  readonly strings: readonly {
    readonly sourceIndex: number;
    readonly sourceText: string;
    readonly text: string;
    readonly edits: readonly StringMutationRecord[];
  }[];
  readonly identical: readonly (readonly boolean[])[];
  readonly levenshtein: readonly (readonly number[])[];
  readonly optimalStringAlignment: readonly (readonly number[])[];
  readonly matricesJson: {
    readonly levenshtein: string;
    readonly optimalStringAlignment: string;
  };
  readonly randomness: GeneratorReplay;
};
const matrixSchema = {
  type: "array",
  minItems: 2,
  maxItems: 32,
  items: {
    type: "array",
    minItems: 2,
    maxItems: 32,
    items: { type: "integer", minimum: 0, maximum: 144 },
  },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTexts: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", maxLength: 128 },
    },
    alphabet: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "string", minLength: 1, maxLength: 2 },
    },
    count: { type: "integer", minimum: 2, maximum: 32 },
    maximumMutations: { type: "integer", minimum: 0, maximum: 8 },
    seed: generatorSeedSchema,
  },
  required: ["sourceTexts", "alphabet", "count", "maximumMutations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strings: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceIndex: { type: "integer", minimum: 0, maximum: 15 },
          sourceText: { type: "string", maxLength: 128 },
          text: { type: "string", maxLength: 144 },
          edits: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                kind: {
                  type: "string",
                  enum: ["insert", "delete", "substitute", "transpose"],
                },
                index: { type: "integer", minimum: 0, maximum: 72 },
                before: { type: "string", maxLength: 4 },
                after: { type: "string", maxLength: 4 },
              },
              required: ["kind", "index", "before", "after"],
            },
          },
        },
        required: ["sourceIndex", "sourceText", "text", "edits"],
      },
    },
    identical: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: {
        type: "array",
        minItems: 2,
        maxItems: 32,
        items: { type: "boolean" },
      },
    },
    levenshtein: matrixSchema,
    optimalStringAlignment: matrixSchema,
    matricesJson: {
      type: "object",
      additionalProperties: false,
      properties: {
        levenshtein: {
          type: "string",
          minLength: 1,
          maxLength: 8192,
          format: "application/json",
        },
        optimalStringAlignment: {
          type: "string",
          minLength: 1,
          maxLength: 8192,
          format: "application/json",
        },
      },
      required: ["levenshtein", "optimalStringAlignment"],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "strings",
    "identical",
    "levenshtein",
    "optimalStringAlignment",
    "matricesJson",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is StringDistanceMatrixInput =>
  matchesModelInput(input, inputSchema);
export const calculateStringDistanceMatrix = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StringDistanceMatrixOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.alphabet).size !== input.alphabet.length)
      simpleError("alphabet", "Entries must be distinct.", "duplicate_entries");
    if (input.sourceTexts.some((text) => [...text].length > 64))
      simpleError(
        "sourceTexts",
        "Source strings are limited to 64 Unicode code points.",
        "resource_limit",
      );
    if (
      input.alphabet.some(
        (symbol) =>
          [...symbol].length !== 1 ||
          ((symbol.codePointAt(0) ?? 0) >= 0xd800 &&
            (symbol.codePointAt(0) ?? 0) <= 0xdfff),
      )
    )
      simpleError(
        "alphabet",
        "Each alphabet entry must be one Unicode scalar value.",
        "invalid_alphabet_symbol",
      );
    const random = createGeneratorRandom(input.seed, context);
    const strings = Array.from({ length: input.count }, () => {
      const sourceIndex = random.integer(0, input.sourceTexts.length - 1),
        sourceText = input.sourceTexts[sourceIndex],
        letters = [...sourceText],
        edits: StringMutationRecord[] = [],
        count = random.integer(0, input.maximumMutations);
      for (let step = 0; step < count; step += 1) {
        const substitutions = letters.flatMap((letter, index) =>
          input.alphabet.some((symbol) => symbol !== letter) ? [index] : [],
        );
        const transpositions = letters.flatMap((letter, index) =>
          index + 1 < letters.length && letter !== letters[index + 1]
            ? [index]
            : [],
        );
        const available: StringMutationRecord["kind"][] = ["insert"];
        if (letters.length > 0) available.push("delete");
        if (substitutions.length) available.push("substitute");
        if (transpositions.length) available.push("transpose");
        const kind = random.pick(available);
        if (kind === "insert") {
          const index = random.integer(0, letters.length),
            after = random.pick(input.alphabet);
          letters.splice(index, 0, after);
          edits.push({ kind, index, before: "", after });
        } else if (kind === "delete") {
          const index = random.integer(0, letters.length - 1),
            before = letters.splice(index, 1)[0];
          edits.push({ kind, index, before, after: "" });
        } else if (kind === "substitute") {
          const index = random.pick(substitutions),
            before = letters[index],
            after = random.pick(
              input.alphabet.filter((symbol) => symbol !== before),
            );
          letters[index] = after;
          edits.push({ kind, index, before, after });
        } else {
          const index = random.pick(transpositions),
            before = letters.slice(index, index + 2).join(""),
            after = letters[index + 1] + letters[index];
          [letters[index], letters[index + 1]] = [
            letters[index + 1],
            letters[index],
          ];
          edits.push({ kind, index, before, after });
        }
      }
      return { sourceIndex, sourceText, text: letters.join(""), edits };
    });
    const levenshtein = strings.map(() => Array<number>(input.count).fill(0)),
      optimalStringAlignment = strings.map(() =>
        Array<number>(input.count).fill(0),
      );
    for (let i = 0; i < strings.length; i += 1)
      for (let j = i + 1; j < strings.length; j += 1) {
        levenshtein[i][j] = levenshtein[j][i] = calculateLevenshtein({
          a: strings[i].text,
          b: strings[j].text,
        }).distance;
        optimalStringAlignment[i][j] = optimalStringAlignment[j][i] =
          calculateDamerauLevenshtein({
            first: strings[i].text,
            second: strings[j].text,
          }).distance;
      }
    const firstJson = matrixAsJson(levenshtein, 0),
      secondJson = matrixAsJson(optimalStringAlignment, 0);
    if (firstJson === null || secondJson === null)
      throw new Error(
        "Generated bounded distance matrices were rejected by the matrix JSON core.",
      );
    return toolSuccess({
      strings,
      identical: strings.map((first) =>
        strings.map((second) => first.text === second.text),
      ),
      levenshtein,
      optimalStringAlignment,
      matricesJson: {
        levenshtein: firstJson,
        optimalStringAlignment: secondJson,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const stringDistanceMatrixExample = {
  input: {
    sourceTexts: ["ab"],
    alphabet: ["a", "b", "c"],
    count: 4,
    maximumMutations: 2,
    seed: 42,
  },
  output: {
    strings: [
      {
        sourceIndex: 0,
        sourceText: "ab",
        text: "ba",
        edits: [
          {
            kind: "transpose",
            index: 0,
            before: "ab",
            after: "ba",
          },
        ],
      },
      {
        sourceIndex: 0,
        sourceText: "ab",
        text: "a",
        edits: [
          {
            kind: "delete",
            index: 1,
            before: "b",
            after: "",
          },
        ],
      },
      {
        sourceIndex: 0,
        sourceText: "ab",
        text: "abc",
        edits: [
          {
            kind: "insert",
            index: 2,
            before: "",
            after: "c",
          },
        ],
      },
      {
        sourceIndex: 0,
        sourceText: "ab",
        text: "ab",
        edits: [],
      },
    ],
    identical: [
      [true, false, false, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, true],
    ],
    levenshtein: [
      [0, 1, 2, 2],
      [1, 0, 2, 1],
      [2, 2, 0, 1],
      [2, 1, 1, 0],
    ],
    optimalStringAlignment: [
      [0, 1, 2, 1],
      [1, 0, 2, 1],
      [2, 2, 0, 1],
      [1, 1, 1, 0],
    ],
    matricesJson: {
      levenshtein: "[[0,1,2,2],[1,0,2,1],[2,2,0,1],[2,1,1,0]]",
      optimalStringAlignment: "[[0,1,2,1],[1,0,2,1],[2,2,0,1],[1,1,1,0]]",
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<StringDistanceMatrixInput, StringDistanceMatrixOutput>;
export const stringDistanceMatrixTool = createModelDefinition<
  StringDistanceMatrixInput,
  StringDistanceMatrixOutput
>({
  id: "random/string-distance-matrix",
  title: "Random String Distance Matrix Generator",
  description:
    "Generate caller-based Unicode-code-point strings using bounded feasible insertion/deletion/substitution/adjacent-swap edits and retain edit records, identity labels, and delegated pairwise Levenshtein/optimal-string-alignment matrices plus JSON; edit count is not minimum distance and OSA is not unrestricted Damerau distance.",
  inputSchema,
  outputSchema,
  execute: calculateStringDistanceMatrix,
});
export const runStringDistanceMatrix = stringDistanceMatrixTool.execute;
export default stringDistanceMatrixTool;
