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
import { runFileExtension } from "../../check/file-extension/tool.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksText,
  mocksBoolean,
  mocksPick,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type FileExtensionEdgeCaseCorpusInput = {
  readonly stems: readonly string[];
  readonly suffixes: readonly string[];
  readonly prefixes: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type FileExtensionEdgeCaseCorpusOutput = {
  readonly cases: readonly {
    readonly kind: string;
    readonly filename: string;
    readonly expectedExtension: string;
    readonly extension: string;
    readonly matches: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    stems: mocksArray(
      { ...mocksLabel, pattern: "^[A-Za-z0-9_-]+(?![\\s\\S])" },
      128,
      1,
    ),
    suffixes: mocksArray(
      { ...mocksLabel, pattern: "^[A-Za-z0-9]+(?![\\s\\S])" },
      128,
      1,
    ),
    prefixes: mocksArray({ ...mocksText, maxLength: 128 }, 128, 1),
    count: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  ["stems", "suffixes", "prefixes", "count"],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      kind: mocksText,
      filename: mocksText,
      expectedExtension: mocksText,
      extension: mocksText,
      matches: mocksBoolean,
    }),
    768,
    6,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: FileExtensionEdgeCaseCorpusInput,
  random: GeneratorRandom,
): Omit<FileExtensionEdgeCaseCorpusOutput, "randomness"> => {
  const cases: FileExtensionEdgeCaseCorpusOutput["cases"][number][] = [];
  for (let i = 0; i < input.count; i += 1) {
    const stem = mocksPick(input.stems, random),
      suffix = mocksPick(input.suffixes, random),
      prefix = mocksPick(input.prefixes, random);
    for (const [kind, name] of [
      ["ordinary", stem + "." + suffix],
      ["hidden", "." + stem],
      ["multiple-dots", stem + ".part." + suffix],
      ["uppercase", stem + "." + suffix.toUpperCase()],
      ["trailing-dot", stem + "." + suffix + "."],
      ["trailing-separator", stem + "." + suffix + "/"],
    ] as const) {
      const filename = prefix + name;
      const outcome = mocksCore(
        runFileExtension({ filename, expectedExtension: suffix }),
        "prefixes",
      );
      cases.push({ kind, filename, expectedExtension: suffix, ...outcome });
    }
  }
  return { cases };
};
export const fileExtensionEdgeCaseCorpusExample = {
  input: {
    stems: ["report", "archive"],
    suffixes: ["csv", "txt"],
    prefixes: ["", "tmp/"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        kind: "ordinary",
        filename: "tmp/archive.csv",
        expectedExtension: "csv",
        extension: "csv",
        matches: true,
      },
      {
        kind: "hidden",
        filename: "tmp/.archive",
        expectedExtension: "csv",
        extension: "",
        matches: false,
      },
      {
        kind: "multiple-dots",
        filename: "tmp/archive.part.csv",
        expectedExtension: "csv",
        extension: "csv",
        matches: true,
      },
      {
        kind: "uppercase",
        filename: "tmp/archive.CSV",
        expectedExtension: "csv",
        extension: "csv",
        matches: true,
      },
      {
        kind: "trailing-dot",
        filename: "tmp/archive.csv.",
        expectedExtension: "csv",
        extension: "",
        matches: false,
      },
      {
        kind: "trailing-separator",
        filename: "tmp/archive.csv/",
        expectedExtension: "csv",
        extension: "",
        matches: false,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  FileExtensionEdgeCaseCorpusInput,
  FileExtensionEdgeCaseCorpusOutput
>;

const isInput = (input: unknown): input is FileExtensionEdgeCaseCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateFileExtensionEdgeCaseCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FileExtensionEdgeCaseCorpusOutput> => {
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
export const fileExtensionEdgeCaseCorpusTool = createModelDefinition<
  FileExtensionEdgeCaseCorpusInput,
  FileExtensionEdgeCaseCorpusOutput
>({
  id: "random/file-extension-edge-case-corpus",
  title: "Random File Extension Edge-Case Corpus Generator",
  description:
    "Compose supplied filename parts into hidden, multi-dot, case, and trailing-separator cases with delegated extension classifications.",
  inputSchema,
  outputSchema,
  execute: calculateFileExtensionEdgeCaseCorpus,
});
export const runFileExtensionEdgeCaseCorpus =
  fileExtensionEdgeCaseCorpusTool.execute;
export default fileExtensionEdgeCaseCorpusTool;
