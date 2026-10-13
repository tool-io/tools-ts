import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
  simpleError,
  pick,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly genotypeKinds: readonly string[];
  readonly alleleAFrequencies: readonly number[];
  readonly alleleBFrequencies: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "genotypeKinds", label: "Genotype kinds", kind: "stringList" },
  {
    id: "alleleAFrequencies",
    label: "Allele a frequencies",
    kind: "numberList",
  },
  {
    id: "alleleBFrequencies",
    label: "Allele b frequencies",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  aligned(i.genotypeKinds, i.alleleAFrequencies, "loci");
  aligned(i.genotypeKinds, i.alleleBFrequencies, "loci");
  if (!i.genotypeKinds.length)
    simpleError("loci", "Actual independently established loci.");
  const p = i.genotypeKinds.map((kind, j) => {
    pick(kind, { homozygous: 0, heterozygous: 1 }, "genotype");
    const a = i.alleleAFrequencies[j],
      b = i.alleleBFrequencies[j];
    positive(a, "frequency");
    fraction(a, "frequency");
    fraction(b, "frequency");
    if (kind === "homozygous") {
      if (b !== a)
        simpleError("frequency", "Same allele frequency for homozygote.");
      return a * a;
    }
    positive(b, "frequency");
    if (a + b > 1)
      simpleError("frequency", "Distinct allele frequencies sum <=1.");
    return 2 * a * b;
  });
  // Compute in log space before products can underflow to zero.
  const log = sum(
    i.genotypeKinds.map((kind, j) =>
      kind === "homozygous"
        ? 2 * Math.log10(i.alleleAFrequencies[j])
        : Math.log10(2) +
          Math.log10(i.alleleAFrequencies[j]) +
          Math.log10(i.alleleBFrequencies[j]),
    ),
  );
  return {
    locusGenotypeProbabilities: p,
    log10RandomMatchProbability: log,
    randomMatchProbability: 10 ** log,
    identityDetermined: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    genotypeKinds: ["homozygous", "heterozygous"],
    alleleAFrequencies: [0.1, 0.2],
    alleleBFrequencies: [0.1, 0.3],
  },
  output: {
    result: {
      locusGenotypeProbabilities: [0.01, 0.12],
      log10RandomMatchProbability: -2.9208187539523753,
      randomMatchProbability: 0.0012,
      identityDetermined: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/dna-random-match-probability-calculator",
  title: "DNA Random Match Probability Calculator",
  description:
    "Toy independent-locus Hardy-Weinberg random-match product p²/2pq with externally validated population frequencies; excludes theta, mixtures, relatives, dropout/errors and likelihood ratios; never identity or guilt determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          locusGenotypeProbabilities: {
            type: "array",
            items: { type: "number" },
          },
          log10RandomMatchProbability: { type: "number" },
          randomMatchProbability: { type: "number" },
          identityDetermined: { type: "boolean" },
        },
        required: [
          "locusGenotypeProbabilities",
          "log10RandomMatchProbability",
          "randomMatchProbability",
          "identityDetermined",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
