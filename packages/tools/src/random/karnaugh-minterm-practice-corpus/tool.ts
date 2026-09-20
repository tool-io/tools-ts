import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateMintermIndexBinaryDecoder } from "../../logic/minterm-index-binary-decoder/tool.js";
import {
  calculateKmapCellCountGridResolver,
  type KmapCellCountGridResolverOutput,
} from "../../logic/kmap-cell-count-grid-resolver/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleCount,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type KarnaughMintermPracticeCorpusInput = {
  readonly minimumVariables: number;
  readonly maximumVariables: number;
  readonly count: number;
  readonly seed?: number;
};
export type KarnaughMintermPracticeCorpusOutput = {
  readonly cases: readonly {
    readonly variables: readonly string[];
    readonly index: number;
    readonly bits: string;
    readonly minterm: string;
    readonly grid: KmapCellCountGridResolverOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const variableCount = { type: "integer", minimum: 0, maximum: 12 } as const;
export const inputSchema = puzzleObject(
  {
    minimumVariables: variableCount,
    maximumVariables: variableCount,
    count: puzzleCount,
    seed: generatorSeedSchema,
  },
  ["minimumVariables", "maximumVariables", "count"],
);
export const outputSchema = puzzleObject({
  cases: puzzleArray(
    puzzleObject({
      variables: puzzleArray({ type: "string" }, 12),
      index: puzzleInteger,
      bits: { type: "string" },
      minterm: { type: "string" },
      grid: puzzleObject({
        cellCount: puzzleInteger,
        rowCount: puzzleInteger,
        columnCount: puzzleInteger,
        rowVariables: puzzleInteger,
        columnVariables: puzzleInteger,
      }),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
export const calculateKarnaughMintermPracticeCorpus = (
  input: KarnaughMintermPracticeCorpusInput,
  context?: ToolExecutionContext,
): ToolResult<KarnaughMintermPracticeCorpusOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (input.minimumVariables > input.maximumVariables)
      simpleError(
        "maximumVariables",
        "Variable-count bounds must be ordered.",
        "invalid_variable_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const variableCount = random.integer(
            input.minimumVariables,
            input.maximumVariables,
          ),
          variables = Array.from(
            { length: variableCount },
            (_, i) => `x${i + 1}`,
          ),
          index = random.integer(0, 2 ** variableCount - 1),
          decoded = puzzleUnwrap(
            calculateMintermIndexBinaryDecoder({ variables, index }),
          ),
          grid = puzzleUnwrap(
            calculateKmapCellCountGridResolver({ variableCount }),
          );
        return {
          variables,
          index,
          bits: decoded.bits,
          minterm: decoded.minterm,
          grid,
        };
      });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const karnaughMintermPracticeCorpusExample = puzzleFreeze({
  input: { minimumVariables: 2, maximumVariables: 4, count: 2, seed: 42 },
  output: {
    cases: [
      {
        variables: ["x1", "x2", "x3"],
        index: 3,
        bits: "011",
        minterm: "!x1 && x2 && x3",
        grid: {
          cellCount: 8,
          rowCount: 2,
          columnCount: 4,
          rowVariables: 1,
          columnVariables: 2,
        },
      },
      {
        variables: ["x1", "x2", "x3", "x4"],
        index: 10,
        bits: "1010",
        minterm: "x1 && !x2 && x3 && !x4",
        grid: {
          cellCount: 16,
          rowCount: 4,
          columnCount: 4,
          rowVariables: 2,
          columnVariables: 2,
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  KarnaughMintermPracticeCorpusInput,
  KarnaughMintermPracticeCorpusOutput
>);
const isInput = (input: unknown): input is KarnaughMintermPracticeCorpusInput =>
  matchesModelInput(input, inputSchema);
export const karnaughMintermPracticeCorpusTool = createModelDefinition<
  KarnaughMintermPracticeCorpusInput,
  KarnaughMintermPracticeCorpusOutput
>({
  id: "random/karnaugh-minterm-practice-corpus",
  title: "Random Karnaugh Minterm Practice Corpus Generator",
  description:
    "Generate bounded minterm indices with delegated binary assignments and balanced map dimensions, without Gray-code placement or minimization.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateKarnaughMintermPracticeCorpus,
  ),
});
export const runKarnaughMintermPracticeCorpus =
  karnaughMintermPracticeCorpusTool.execute;
export default karnaughMintermPracticeCorpusTool;
