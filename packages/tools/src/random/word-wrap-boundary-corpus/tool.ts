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
import { calculateWordWrap } from "../../text/word-wrap/tool.js";
import { runJustifyLines } from "../../text/justify-lines/tool.js";

export type WordWrapBoundaryCorpusInput = {
  readonly words: readonly string[];
  readonly separators: readonly string[];
  readonly wordCount: number;
  readonly minimumWidth: number;
  readonly maximumWidth: number;
  readonly count: number;
  readonly seed?: number;
};
export type WordWrapBoundaryCorpusOutput = {
  readonly cases: readonly {
    readonly text: string;
    readonly width: number;
    readonly wrapped: {
      readonly wrappedText: string;
      readonly lineCount: number;
    };
    readonly justified: {
      readonly ok: boolean;
      readonly text: string | null;
      readonly errorCode: string | null;
      readonly errorMessage: string | null;
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const separatorSchema = {
  type: "string",
  enum: [" ", "  ", "\t", "\n", "\r\n", "\n\n"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    words: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "string",
        minLength: 1,
        maxLength: 128,
        pattern: "^[!-~]+(?![\\s\\S])",
      },
    },
    separators: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: separatorSchema,
    },
    wordCount: { type: "integer", minimum: 1, maximum: 64 },
    minimumWidth: { type: "integer", minimum: 1, maximum: 500 },
    maximumWidth: { type: "integer", minimum: 1, maximum: 500 },
    count: { type: "integer", minimum: 1, maximum: 32 },
    seed: generatorSeedSchema,
  },
  required: [
    "words",
    "separators",
    "wordCount",
    "minimumWidth",
    "maximumWidth",
    "count",
  ],
} as const;
const nullableText = { anyOf: [{ type: "string" }, { type: "null" }] } as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", minLength: 1, maxLength: 8318 },
          width: { type: "integer", minimum: 1, maximum: 500 },
          wrapped: {
            type: "object",
            additionalProperties: false,
            properties: {
              wrappedText: { type: "string" },
              lineCount: { type: "integer", minimum: 1, maximum: 64 },
            },
            required: ["wrappedText", "lineCount"],
          },
          justified: {
            type: "object",
            additionalProperties: false,
            properties: {
              ok: { type: "boolean" },
              text: nullableText,
              errorCode: nullableText,
              errorMessage: nullableText,
            },
            required: ["ok", "text", "errorCode", "errorMessage"],
          },
        },
        required: ["text", "width", "wrapped", "justified"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is WordWrapBoundaryCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateWordWrapBoundaryCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WordWrapBoundaryCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumWidth > input.maximumWidth)
      simpleError(
        "maximumWidth",
        "Width bounds must be ordered.",
        "invalid_width_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const width = random.integer(input.minimumWidth, input.maximumWidth);
      let text = "";
      for (let i = 0; i < input.wordCount; i += 1) {
        text += random.pick(input.words);
        if (i + 1 < input.wordCount) text += random.pick(input.separators);
      }
      const wrapped = calculateWordWrap({ text, width }),
        result = runJustifyLines({ text, width });
      const justified = result.ok
        ? {
            ok: true,
            text: result.output.text,
            errorCode: null,
            errorMessage: null,
          }
        : {
            ok: false,
            text: null,
            errorCode: result.error.issues[0]?.code ?? result.error.code,
            errorMessage: result.error.issues[0]?.message ?? result.error.code,
          };
      return { text, width, wrapped, justified };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const wordWrapBoundaryCorpusExample = {
  input: {
    words: ["one", "two", "longword"],
    separators: [" ", "  ", "\r\n"],
    wordCount: 5,
    minimumWidth: 5,
    maximumWidth: 12,
    count: 2,
    seed: 42,
  },
  output: {
    cases: [
      {
        text: "two\r\nlongword two two\r\ntwo",
        width: 9,
        wrapped: {
          wrappedText: "two\nlongword\ntwo two\ntwo",
          lineCount: 4,
        },
        justified: {
          ok: true,
          text: "two\nlongword\ntwo   two\ntwo",
          errorCode: null,
          errorMessage: null,
        },
      },
      {
        text: "longword\r\none two\r\ntwo two",
        width: 6,
        wrapped: {
          wrappedText: "longword\none\ntwo\ntwo\ntwo",
          lineCount: 5,
        },
        justified: {
          ok: false,
          text: null,
          errorCode: "invalid_value",
          errorMessage:
            "A word is longer than the requested width; this tool does not split words.",
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  WordWrapBoundaryCorpusInput,
  WordWrapBoundaryCorpusOutput
>;
export const wordWrapBoundaryCorpusTool = createModelDefinition<
  WordWrapBoundaryCorpusInput,
  WordWrapBoundaryCorpusOutput
>({
  id: "random/word-wrap-boundary-corpus",
  title: "Random Word Wrap Boundary Corpus Generator",
  description:
    "Compose fresh ASCII word/separator sequences and inclusive line-width draws, then compare greedy wrapping with paragraph-aware justification. Whitespace and long-token boundaries are retained; wrap keeps overlong words while justification returns its actual structured rejection, using UTF-16/ASCII widths rather than display-column estimates.",
  inputSchema,
  outputSchema,
  execute: calculateWordWrapBoundaryCorpus,
});
export const runWordWrapBoundaryCorpus = wordWrapBoundaryCorpusTool.execute;
export default wordWrapBoundaryCorpusTool;
