import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly observedMutations: readonly string[];
  readonly cladeNames: readonly string[];
  readonly signatureSets: readonly string[];
  readonly minimumMatchFraction: number;
}>;
export type Output = Readonly<{
  readonly matchFractions: readonly number[];
  readonly matchingClades: readonly string[];
  readonly ambiguous: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.cladeNames, input.signatureSets, "cladeNames");
  if (input.signatureSets.reduce((sum, v) => sum + v.length, 0) > 1000000)
    simpleError(
      "signatureSets",
      "Combined signature text exceeds the character budget.",
    );
  fraction(input.minimumMatchFraction, "minimumMatchFraction");
  if (new Set(input.cladeNames).size !== input.cladeNames.length)
    simpleError("cladeNames", "Distinct candidate clade names required.");
  const observed = new Set(input.observedMutations),
    matchFractions = input.signatureSets.map((text) => {
      const mutations = text.split(";").map((v) => v.trim());
      if (
        mutations.some((v) => !v) ||
        new Set(mutations).size !== mutations.length
      )
        simpleError(
          "signatureSets",
          "Semicolon-delimited distinct nonempty signature mutations required.",
        );
      return mutations.filter((v) => observed.has(v)).length / mutations.length;
    }),
    matchingClades = input.cladeNames.filter(
      (_, i) => matchFractions[i] >= input.minimumMatchFraction,
    );
  return {
    matchFractions,
    matchingClades,
    ambiguous: matchingClades.length > 1,
  };
};
export const exampleInput = {
  observedMutations: ["A", "B"],
  cladeNames: ["X", "Y"],
  signatureSets: ["A;B", "B;C"],
  minimumMatchFraction: 1,
} satisfies Input;
export const exampleOutput = {
  matchFractions: [1, 0.5],
  matchingClades: ["X"],
  ambiguous: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/clade-signature-support",
  title: "Clade Signature Support",
  description:
    "Score caller-defined multi-mutation clade signatures, retaining ambiguous matches rather than asserting lineage assignment.",
  inputs: [
    {
      id: "observedMutations",
      label: "Observed mutations",
      kind: "stringList",
    },
    { id: "cladeNames", label: "Clade names", kind: "stringList" },
    { id: "signatureSets", label: "Signature sets", kind: "stringList" },
    {
      id: "minimumMatchFraction",
      label: "Minimum match fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "matchFractions", label: "Match fractions", kind: "numberList" },
    { id: "matchingClades", label: "Matching clades", kind: "stringList" },
    { id: "ambiguous", label: "Ambiguous", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observedMutations: value.observedMutations as readonly string[],
      cladeNames: value.cladeNames as readonly string[],
      signatureSets: value.signatureSets as readonly string[],
      minimumMatchFraction: value.minimumMatchFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
