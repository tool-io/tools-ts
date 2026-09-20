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
import { calculateSemanticVersionRange } from "../../development/semantic-version-range/tool.js";
import { calculate as parseVersion } from "../../development/version-parse/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksInteger,
  mocksText,
  mocksBoolean,
  mocksPick,
  mocksOrdered,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type SemanticVersionRangeCorpusInput = {
  readonly count: number;
  readonly ranges: readonly string[];
  readonly minimumComponent: number;
  readonly maximumComponent: number;
  readonly seed?: number;
};
export type SemanticVersionRangeCorpusOutput = {
  readonly cases: readonly {
    readonly role: "sample" | "matched-control" | "unmatched-control";
    readonly range: string;
    readonly version: string;
    readonly comparatorCount: number;
    readonly satisfied: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    count: { type: "integer", minimum: 1, maximum: 32 },
    ranges: mocksArray({ ...mocksText, maxLength: 512 }, 32, 1),
    minimumComponent: { ...mocksInteger, minimum: 0 },
    maximumComponent: { ...mocksInteger, minimum: 0 },
    seed: generatorSeedSchema,
  },
  ["count", "ranges", "minimumComponent", "maximumComponent"],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      role: {
        type: "string",
        enum: ["sample", "matched-control", "unmatched-control"],
      },
      range: mocksText,
      version: mocksText,
      comparatorCount: mocksInteger,
      satisfied: mocksBoolean,
    }),
    96,
    3,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: SemanticVersionRangeCorpusInput,
  random: GeneratorRandom,
): Omit<SemanticVersionRangeCorpusOutput, "randomness"> => {
  mocksOrdered(
    input.minimumComponent,
    input.maximumComponent,
    "maximumComponent",
  );
  // Preflight every caller range, including unsampled entries; do not silently omit unsupported syntax.
  for (const range of input.ranges) {
    for (const token of range.trim().split(/\s+/).filter(Boolean)) {
      const bound = token.replace(/^(?:>=|<=|>|<|=|\^|~)/, "");
      const parsed = parseVersion({ actualVersionText: bound }).result;
      if (
        [parsed.major, parsed.minor, parsed.patch].some(
          (v) => typeof v !== "number" || v >= Number.MAX_SAFE_INTEGER,
        )
      )
        simpleError(
          "ranges",
          "Range bounds need safe components with room for shorthand increments.",
          "unsafe_range_bound",
        );
      const suffix = parsed.prerelease;
      if (typeof suffix !== "string")
        throw new Error(
          "Version parser returned an unexpected prerelease shape.",
        );
      if (
        suffix
          .split(".")
          .some(
            (part) =>
              /^[0-9]+(?![\s\S])/.test(part) &&
              !Number.isSafeInteger(Number(part)),
          )
      )
        simpleError(
          "ranges",
          "Numeric prerelease identifiers must be safe.",
          "unsafe_range_bound",
        );
    }
    calculateSemanticVersionRange({ range, version: "0.0.0" });
  }
  const cases: SemanticVersionRangeCorpusOutput["cases"][number][] = [];
  for (let i = 0; i < input.count; i += 1) {
    const range = mocksPick(input.ranges, random);
    const version = [0, 1, 2]
      .map(() => random.integer(input.minimumComponent, input.maximumComponent))
      .join(".");
    parseVersion({ actualVersionText: version });
    for (const [role, selected] of [
      ["sample", range],
      ["matched-control", "=" + version],
      ["unmatched-control", ">" + version],
    ] as const)
      cases.push({
        role,
        range: selected,
        version,
        ...calculateSemanticVersionRange({ range: selected, version }),
      });
  }
  return { cases };
};
export const semanticVersionRangeCorpusExample = {
  input: {
    count: 1,
    ranges: ["^1.0.0", ">=2.0.0 <3.0.0"],
    minimumComponent: 1,
    maximumComponent: 3,
    seed: 42,
  },
  output: {
    cases: [
      {
        role: "sample",
        range: ">=2.0.0 <3.0.0",
        version: "2.3.3",
        comparatorCount: 2,
        satisfied: true,
      },
      {
        role: "matched-control",
        range: "=2.3.3",
        version: "2.3.3",
        comparatorCount: 1,
        satisfied: true,
      },
      {
        role: "unmatched-control",
        range: ">2.3.3",
        version: "2.3.3",
        comparatorCount: 1,
        satisfied: false,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  SemanticVersionRangeCorpusInput,
  SemanticVersionRangeCorpusOutput
>;

const isInput = (input: unknown): input is SemanticVersionRangeCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateSemanticVersionRangeCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SemanticVersionRangeCorpusOutput> => {
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
export const semanticVersionRangeCorpusTool = createModelDefinition<
  SemanticVersionRangeCorpusInput,
  SemanticVersionRangeCorpusOutput
>({
  id: "random/semantic-version-range-corpus",
  title: "Random Semantic Version Range Corpus Generator",
  description:
    "Generate version and range cases with exact matched and unmatched controls using the existing range checker's supported grammar.",
  inputSchema,
  outputSchema,
  execute: calculateSemanticVersionRangeCorpus,
});
export const runSemanticVersionRangeCorpus =
  semanticVersionRangeCorpusTool.execute;
export default semanticVersionRangeCorpusTool;
