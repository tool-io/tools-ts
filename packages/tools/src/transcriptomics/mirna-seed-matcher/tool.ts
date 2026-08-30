import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mirna: string;
  readonly targetRna: string;
  readonly seedStart: number;
  readonly seedLength: number;
}>;
export type Output = Readonly<{
  readonly seed: string;
  readonly reverseComplement: string;
  readonly matchPositions: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const mirna = input.mirna.toUpperCase(),
    target = input.targetRna.toUpperCase();
  if (
    !/^[ACGU]+$/.test(mirna) ||
    !/^[ACGU]+$/.test(target) ||
    input.seedStart < 1 ||
    input.seedLength < 1 ||
    input.seedStart - 1 + input.seedLength > mirna.length
  )
    simpleError(
      "mirna",
      "Valid RNA sequences and an in-range seed are required.",
    );
  const seed = mirna.slice(
      input.seedStart - 1,
      input.seedStart - 1 + input.seedLength,
    ),
    reverseComplement = [...seed]
      .reverse()
      .map(
        (v) =>
          (({ A: "U", U: "A", C: "G", G: "C" }) as Record<string, string>)[v],
      )
      .join(""),
    matchPositions: number[] = [];
  for (let i = 0; i <= target.length - reverseComplement.length; i++)
    if (target.slice(i, i + reverseComplement.length) === reverseComplement)
      matchPositions.push(i);
  return { seed, reverseComplement, matchPositions };
};

export const exampleInput = {
  mirna: "AUGCUAAA",
  targetRna: "AAAAGCAUCCC",
  seedStart: 2,
  seedLength: 7,
} satisfies Input;
export const exampleOutput = {
  seed: "UGCUAAA",
  reverseComplement: "UUUAGCA",
  matchPositions: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/mirna-seed-matcher",
  title: "miRNA Seed Matcher",
  description:
    "Locate reverse-complementary miRNA seed matches in a target RNA.",
  inputs: [
    { id: "mirna", kind: "string", label: "miRNA" },
    { id: "targetRna", kind: "string", label: "Target rna" },
    { id: "seedStart", kind: "number", label: "Seed start" },
    { id: "seedLength", kind: "number", label: "Seed length" },
  ],
  outputs: [
    { id: "seed", kind: "string", label: "Seed" },
    { id: "reverseComplement", kind: "string", label: "Reverse complement" },
    { id: "matchPositions", kind: "numberList", label: "Match positions" },
  ],
  calculate: (value) =>
    calculate({
      mirna: value.mirna as string,
      targetRna: value.targetRna as string,
      seedStart: value.seedStart as number,
      seedLength: value.seedLength as number,
    }),
});
export const run = tool.execute;
export default tool;
