import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly locusNames: readonly string[];
  readonly firstAlleles: readonly string[];
  readonly secondAlleles: readonly string[];
  readonly maximumMismatches: number;
}>;
export type Output = Readonly<{
  readonly mismatchedLoci: readonly string[];
  readonly mismatchCount: number;
  readonly withinTolerance: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.locusNames, input.firstAlleles, "locusNames");
  aligned(input.locusNames, input.secondAlleles, "locusNames");
  count(input.maximumMismatches, "maximumMismatches");
  const normalize = (v: string) => {
    const alleles = v.split("/").map((x) => x.trim());
    if (alleles.length !== 2 || alleles.some((x) => !x))
      simpleError(
        "firstAlleles",
        "Two explicit slash-separated allele calls required.",
      );
    return alleles.sort().join("/");
  };
  const mismatchedLoci = input.locusNames.filter(
    (_, i) =>
      normalize(input.firstAlleles[i]) !== normalize(input.secondAlleles[i]),
  );
  return {
    mismatchedLoci,
    mismatchCount: mismatchedLoci.length,
    withinTolerance: mismatchedLoci.length <= input.maximumMismatches,
  };
};
export const exampleInput = {
  locusNames: ["A", "B", "C"],
  firstAlleles: ["12/13", "10/11", "8/9"],
  secondAlleles: ["12/13", "10/10", "8/9"],
  maximumMismatches: 1,
} satisfies Input;
export const exampleOutput = {
  mismatchedLoci: ["B"],
  mismatchCount: 1,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/exclusion-mismatch-tolerance",
  title: "Exclusion Mismatch Tolerance",
  description:
    "Count exact diploid STR genotype mismatches against a caller-defined tolerance; not a paternity conclusion.",
  inputs: [
    { id: "locusNames", label: "Locus names", kind: "stringList" },
    { id: "firstAlleles", label: "First alleles", kind: "stringList" },
    { id: "secondAlleles", label: "Second alleles", kind: "stringList" },
    { id: "maximumMismatches", label: "Maximum mismatches", kind: "integer" },
  ],
  outputs: [
    { id: "mismatchedLoci", label: "Mismatched loci", kind: "stringList" },
    { id: "mismatchCount", label: "Mismatch count", kind: "number" },
    { id: "withinTolerance", label: "Within tolerance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      locusNames: value.locusNames as readonly string[],
      firstAlleles: value.firstAlleles as readonly string[],
      secondAlleles: value.secondAlleles as readonly string[],
      maximumMismatches: value.maximumMismatches as number,
    }),
});
export const run = tool.execute;
export default tool;
