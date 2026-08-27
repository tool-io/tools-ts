import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PunnettSquareMonoInput = {
  readonly parentA: "AA" | "Aa" | "aa";
  readonly parentB: "AA" | "Aa" | "aa";
};

export type PunnettSquareMonoOutput = {
  readonly offspringProbabilities: {
    readonly heterozygous: number;
    readonly homozygousDominant: number;
    readonly homozygousRecessive: number;
  };
};

export const punnettSquareMonoExample = {
  input: { parentA: "Aa", parentB: "Aa" },
  output: {
    offspringProbabilities: {
      homozygousDominant: 0.25,
      heterozygous: 0.5,
      homozygousRecessive: 0.25,
    },
  },
} satisfies ToolExample<PunnettSquareMonoInput, PunnettSquareMonoOutput>;

const gametesFor = (parent: PunnettSquareMonoInput["parentA"]): string[] =>
  parent === "AA" ? ["A", "A"] : parent === "Aa" ? ["A", "a"] : ["a", "a"];

export const punnettSquareMonoTool = createSimpleTool({
  id: "biology/punnett-square-mono",
  title: "Monohybrid Punnett",
  description:
    "Compute offspring genotype probabilities for a monohybrid cross between two parents.",
  inputs: [
    {
      enum: ["AA", "Aa", "aa"],
      id: "parentA",
      kind: "string",
      label: "Parent A genotype",
    },
    {
      enum: ["AA", "Aa", "aa"],
      id: "parentB",
      kind: "string",
      label: "Parent B genotype",
    },
  ],
  outputs: [
    {
      id: "offspringProbabilities",
      kind: "object",
      label: "Offspring genotype probabilities",
    },
  ],
  calculate: (input) => {
    const gametesA = gametesFor(
      input.parentA as PunnettSquareMonoInput["parentA"],
    );
    const gametesB = gametesFor(
      input.parentB as PunnettSquareMonoInput["parentB"],
    );
    let homozygousDominant = 0;
    let heterozygous = 0;
    let homozygousRecessive = 0;
    for (const alleleA of gametesA)
      for (const alleleB of gametesB) {
        const pair = [alleleA, alleleB].sort().join("");
        if (pair === "AA") homozygousDominant += 0.25;
        else if (pair === "Aa") heterozygous += 0.25;
        else homozygousRecessive += 0.25;
      }
    return {
      offspringProbabilities: {
        homozygousDominant,
        heterozygous,
        homozygousRecessive,
      },
    };
  },
});
export const runPunnettSquareMono = punnettSquareMonoTool.execute;
export default punnettSquareMonoTool;
