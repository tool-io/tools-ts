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
import { calculate as parseVersion } from "../../development/version-parse/tool.js";
import { calculateSemanticVersionCompare } from "../../development/semantic-version-compare/tool.js";
import {
  mocksArray,
  mocksObject,
  mocksInteger,
  mocksLabel,
  mocksCount,
  mocksPick,
  mocksOrdered,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type SemanticVersionOrderingCorpusInput = {
  readonly count: number;
  readonly minimumComponent: number;
  readonly maximumComponent: number;
  readonly prereleaseLabels: readonly string[];
  readonly buildLabels: readonly string[];
  readonly seed?: number;
};
export type SemanticVersionOrderingCorpusOutput = {
  readonly versions: readonly string[];
  readonly sortedIndices: readonly number[];
  readonly precedenceGroups: readonly {
    readonly indices: readonly number[];
    readonly distinctSpellings: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    count: { ...mocksCount, maximum: 32 },
    minimumComponent: { ...mocksInteger, minimum: 0 },
    maximumComponent: { ...mocksInteger, minimum: 0 },
    prereleaseLabels: mocksArray(
      { ...mocksLabel, pattern: "^[A-Za-z][A-Za-z0-9-]*(?![\\s\\S])" },
      32,
      1,
    ),
    buildLabels: mocksArray(
      { ...mocksLabel, pattern: "^[A-Za-z][A-Za-z0-9-]*(?![\\s\\S])" },
      32,
      1,
    ),
    seed: generatorSeedSchema,
  },
  [
    "count",
    "minimumComponent",
    "maximumComponent",
    "prereleaseLabels",
    "buildLabels",
  ],
);
export const outputSchema = mocksObject({
  versions: mocksArray({ type: "string" }, 128, 4),
  sortedIndices: mocksArray(mocksInteger, 128, 4),
  precedenceGroups: mocksArray(
    mocksObject({
      indices: mocksArray(mocksInteger),
      distinctSpellings: mocksInteger,
    }),
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: SemanticVersionOrderingCorpusInput,
  random: GeneratorRandom,
): Omit<SemanticVersionOrderingCorpusOutput, "randomness"> => {
  mocksOrdered(
    input.minimumComponent,
    input.maximumComponent,
    "maximumComponent",
  );
  const versions: string[] = [];
  for (let i = 0; i < input.count; i += 1) {
    const core = [0, 1, 2]
      .map(() => random.integer(input.minimumComponent, input.maximumComponent))
      .join(".");
    const pre =
      mocksPick(input.prereleaseLabels, random) + "." + random.integer(0, 9);
    const build =
      mocksPick(input.buildLabels, random) + "." + random.integer(0, 9);
    versions.push(
      core + "-" + pre,
      core,
      core + "+" + build,
      core + "+" + build,
    );
  }
  for (const text of versions) parseVersion({ actualVersionText: text });
  const compare = (a: number, b: number): number =>
    calculateSemanticVersionCompare({
      versionA: versions[a],
      versionB: versions[b],
    }).comparison;
  const sortedIndices = versions
    .map((_, i) => i)
    .sort((a, b) => compare(a, b) || a - b);
  const groups: number[][] = [];
  for (const index of sortedIndices) {
    const last = groups.at(-1);
    if (last && compare(last[0], index) === 0) last.push(index);
    else groups.push([index]);
  }
  return {
    versions,
    sortedIndices,
    precedenceGroups: groups.map((indices) => ({
      indices,
      distinctSpellings: new Set(indices.map((i) => versions[i])).size,
    })),
  };
};
export const semanticVersionOrderingCorpusExample = {
  input: {
    count: 1,
    minimumComponent: 1,
    maximumComponent: 3,
    prereleaseLabels: ["alpha", "rc"],
    buildLabels: ["ci", "local"],
    seed: 42,
  },
  output: {
    versions: ["2.2.3-rc.1", "2.2.3", "2.2.3+local.2", "2.2.3+local.2"],
    sortedIndices: [0, 1, 2, 3],
    precedenceGroups: [
      { indices: [0], distinctSpellings: 1 },
      { indices: [1, 2, 3], distinctSpellings: 2 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  SemanticVersionOrderingCorpusInput,
  SemanticVersionOrderingCorpusOutput
>;

const isInput = (input: unknown): input is SemanticVersionOrderingCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateSemanticVersionOrderingCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SemanticVersionOrderingCorpusOutput> => {
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
export const semanticVersionOrderingCorpusTool = createModelDefinition<
  SemanticVersionOrderingCorpusInput,
  SemanticVersionOrderingCorpusOutput
>({
  id: "random/semantic-version-ordering-corpus",
  title: "Random Semantic Version Ordering Corpus Generator",
  description:
    "Generate synthetic safe-component semantic versions with prereleases, build precedence ties, exact duplicates, and a stable sorted answer key.",
  inputSchema,
  outputSchema,
  execute: calculateSemanticVersionOrderingCorpus,
});
export const runSemanticVersionOrderingCorpus =
  semanticVersionOrderingCorpusTool.execute;
export default semanticVersionOrderingCorpusTool;
