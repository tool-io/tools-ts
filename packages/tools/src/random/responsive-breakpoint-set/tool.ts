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
import { generatorSampleIndices } from "../generator-random.js";
import { runSortNumbers } from "../../list/sort-numbers/tool.js";
import { runUnique } from "../../list/unique/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  coreOutput,
  ensureOutput,
} from "../m250-css-music-space-support.js";
export type ResponsiveBreakpointSetInput = {
  readonly count: number;
  readonly minimumWidthPx: number;
  readonly maximumWidthPx: number;
  readonly minimumGapPx: number;
  readonly seed?: number;
};
export type ResponsiveBreakpointSetOutput = {
  readonly widthsPx: readonly number[];
  readonly mediaQueries: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: countSchema(64),
    minimumWidthPx: { type: "integer", minimum: 0 },
    maximumWidthPx: { type: "integer", minimum: 0 },
    minimumGapPx: { type: "integer", minimum: 1 },
    seed: generatorSeedSchema,
  },
  ["count", "minimumWidthPx", "maximumWidthPx", "minimumGapPx"],
);
export const outputSchema = objectSchema({
  widthsPx: arraySchema({ type: "integer", minimum: 0 }, 64, 1),
  mediaQueries: arraySchema({ type: "string", maxLength: 128 }, 64, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ResponsiveBreakpointSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateResponsiveBreakpointSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ResponsiveBreakpointSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.minimumWidthPx > input.maximumWidthPx)
      simpleError(
        "maximumWidthPx",
        "Width bounds must be ordered.",
        "inverted_range",
      );
    const span = BigInt(input.maximumWidthPx) - BigInt(input.minimumWidthPx),
      required = BigInt(input.count - 1) * BigInt(input.minimumGapPx);
    if (required > span)
      simpleError(
        "count",
        "Requested distinct widths and gaps cannot fit the interval.",
        "infeasible_spacing",
      );
    const population =
      span + 1n - BigInt(input.count - 1) * BigInt(input.minimumGapPx - 1);
    if (population > BigInt(Number.MAX_SAFE_INTEGER))
      simpleError(
        "maximumWidthPx",
        "Compressed population exceeds safe integer precision.",
        "numeric_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      sample = generatorSampleIndices(Number(population), input.count, random);
    const sorted = coreOutput(
      runSortNumbers({ values: sample, descending: false }),
    ).values;
    const widthsPx = sorted.map((x, i) =>
      Number(
        BigInt(input.minimumWidthPx) +
          BigInt(x) +
          BigInt(i) * BigInt(input.minimumGapPx - 1),
      ),
    );
    const unique = coreOutput(
      runUnique({ values: widthsPx.map(String) }),
    ).values;
    if (unique.length !== input.count)
      throw new Error("Gap expansion lost distinctness.");
    return toolSuccess(
      ensureOutput(
        {
          widthsPx,
          mediaQueries: widthsPx.map(
            (width) => "@media (min-width: " + width + "px)",
          ),
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const responsiveBreakpointSetExample = {
  input: {
    count: 3,
    minimumWidthPx: 320,
    maximumWidthPx: 960,
    minimumGapPx: 320,
    seed: 42,
  },
  output: {
    widthsPx: [320, 640, 960],
    mediaQueries: [
      "@media (min-width: 320px)",
      "@media (min-width: 640px)",
      "@media (min-width: 960px)",
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ResponsiveBreakpointSetInput,
  ResponsiveBreakpointSetOutput
>;
export const responsiveBreakpointSetTool = createModelDefinition<
  ResponsiveBreakpointSetInput,
  ResponsiveBreakpointSetOutput
>({
  id: "random/responsive-breakpoint-set",
  title: "Random Responsive Breakpoint Set Generator",
  description:
    "Generate distinct ordered integer breakpoint widths with a caller-selected minimum gap and exact feasibility checks.",
  inputSchema,
  outputSchema,
  execute: calculateResponsiveBreakpointSet,
});
export const runResponsiveBreakpointSet = responsiveBreakpointSetTool.execute;
export default responsiveBreakpointSetTool;
