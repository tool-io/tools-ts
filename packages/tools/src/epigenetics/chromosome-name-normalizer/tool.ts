import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly chromosomeNames: readonly string[];
  readonly requireChrPrefix: boolean;
}>;
export type Output = Readonly<{
  readonly normalizedNames: readonly string[];
  readonly changedCount: number;
  readonly duplicateNames: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const normalizedNames = input.chromosomeNames.map((value) => {
      const clean = value.trim().replace(/^chr/i, "");
      return input.requireChrPrefix ? `chr${clean}` : clean;
    }),
    changedCount = normalizedNames.filter(
      (value, index) => value !== input.chromosomeNames[index],
    ).length,
    duplicateNames = [
      ...new Set(
        normalizedNames.filter(
          (value, index) => normalizedNames.indexOf(value) !== index,
        ),
      ),
    ];
  return { normalizedNames, changedCount, duplicateNames };
};

export const exampleInput = {
  chromosomeNames: ["1", "chr2", "chrM"],
  requireChrPrefix: true,
} satisfies Input;
export const exampleOutput = {
  normalizedNames: ["chr1", "chr2", "chrM"],
  changedCount: 1,
  duplicateNames: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      chromosomeNames: input.chromosomeNames as readonly string[],
      requireChrPrefix: input.requireChrPrefix as boolean,
    }),
  description:
    "Normalize chromosome names to a caller-selected chr-prefix convention.",
  id: "epigenetics/chromosome-name-normalizer",
  inputs: [
    { id: "chromosomeNames", label: "Chromosome names", kind: "stringList" },
    { id: "requireChrPrefix", label: "Require chr prefix", kind: "boolean" },
  ],
  outputs: [
    {
      id: "normalizedNames",
      label: "Normalized chromosome names",
      kind: "stringList",
    },
    {
      id: "changedCount",
      label: "Changed name count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "duplicateNames",
      label: "Duplicate normalized names",
      kind: "stringList",
    },
  ],
  title: "Chromosome Name Normalizer",
});

export const run = tool.execute;
export default tool;
