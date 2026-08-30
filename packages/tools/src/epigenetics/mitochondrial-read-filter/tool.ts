import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly readChromosomes: readonly string[];
  readonly mitochondrialAliases: readonly string[];
}>;
export type Output = Readonly<{
  readonly retainedChromosomes: readonly string[];
  readonly excludedReadCount: number;
  readonly excludedPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.readChromosomes.length === 0)
    simpleError(
      "readChromosomes",
      "At least one read chromosome is required.",
      "empty_reads",
    );
  const aliases = new Set(
      input.mitochondrialAliases.map((value) => value.trim().toLowerCase()),
    ),
    retainedChromosomes = input.readChromosomes.filter(
      (value) => !aliases.has(value.trim().toLowerCase()),
    ),
    excludedReadCount =
      input.readChromosomes.length - retainedChromosomes.length;
  return {
    retainedChromosomes,
    excludedReadCount,
    excludedPercent: (excludedReadCount / input.readChromosomes.length) * 100,
  };
};

export const exampleInput = {
  readChromosomes: ["chr1", "chrM", "MT", "chr2"],
  mitochondrialAliases: ["chrM", "MT"],
} satisfies Input;
export const exampleOutput = {
  retainedChromosomes: ["chr1", "chr2"],
  excludedReadCount: 2,
  excludedPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      readChromosomes: input.readChromosomes as readonly string[],
      mitochondrialAliases: input.mitochondrialAliases as readonly string[],
    }),
  description:
    "Filter mitochondrial reads using caller-supplied chromosome aliases.",
  id: "epigenetics/mitochondrial-read-filter",
  inputs: [
    {
      id: "readChromosomes",
      label: "Read chromosome names",
      kind: "stringList",
    },
    {
      id: "mitochondrialAliases",
      label: "Mitochondrial chromosome aliases",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "retainedChromosomes",
      label: "Retained read chromosomes",
      kind: "stringList",
    },
    {
      id: "excludedReadCount",
      label: "Excluded mitochondrial reads",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "excludedPercent",
      label: "Excluded read share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Mitochondrial Read Filter",
});

export const run = tool.execute;
export default tool;
