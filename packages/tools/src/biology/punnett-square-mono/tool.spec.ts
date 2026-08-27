import { describe, expect, it } from "vitest";
import { punnettSquareMonoExample, runPunnettSquareMono } from "./tool.js";

const probabilitiesSumToOne = (probabilities: {
  heterozygous: number;
  homozygousDominant: number;
  homozygousRecessive: number;
}): number =>
  probabilities.heterozygous +
  probabilities.homozygousDominant +
  probabilities.homozygousRecessive;

describe("Monohybrid Punnett", () => {
  it("matches the canonical example", () => {
    const result = runPunnettSquareMono(punnettSquareMonoExample.input);
    expect(result).toEqual({
      ok: true,
      output: punnettSquareMonoExample.output,
    });
  });
  it("produces all dominant offspring from AA x AA", () =>
    expect(runPunnettSquareMono({ parentA: "AA", parentB: "AA" })).toEqual({
      ok: true,
      output: {
        offspringProbabilities: {
          homozygousDominant: 1,
          heterozygous: 0,
          homozygousRecessive: 0,
        },
      },
    }));
  it("splits evenly from AA x aa", () =>
    expect(runPunnettSquareMono({ parentA: "AA", parentB: "aa" })).toEqual({
      ok: true,
      output: {
        offspringProbabilities: {
          homozygousDominant: 0,
          heterozygous: 1,
          homozygousRecessive: 0,
        },
      },
    }));
  it("gives a three-to-one split from Aa x Aa", () =>
    expect(runPunnettSquareMono({ parentA: "Aa", parentB: "Aa" })).toEqual({
      ok: true,
      output: {
        offspringProbabilities: {
          homozygousDominant: 0.25,
          heterozygous: 0.5,
          homozygousRecessive: 0.25,
        },
      },
    }));
  it("mixes evenly from AA x Aa", () =>
    expect(runPunnettSquareMono({ parentA: "AA", parentB: "Aa" })).toEqual({
      ok: true,
      output: {
        offspringProbabilities: {
          homozygousDominant: 0.5,
          heterozygous: 0.5,
          homozygousRecessive: 0,
        },
      },
    }));
  it("produces all recessive offspring from aa x aa", () =>
    expect(runPunnettSquareMono({ parentA: "aa", parentB: "aa" })).toEqual({
      ok: true,
      output: {
        offspringProbabilities: {
          homozygousDominant: 0,
          heterozygous: 0,
          homozygousRecessive: 1,
        },
      },
    }));
  it("is symmetric between parents", () => {
    const forward = runPunnettSquareMono({ parentA: "Aa", parentB: "aa" });
    const reverse = runPunnettSquareMono({ parentA: "aa", parentB: "Aa" });
    expect(forward).toEqual(reverse);
  });
  it("sums probabilities to one for every cross", () => {
    for (const parentA of ["AA", "Aa", "aa"] as const)
      for (const parentB of ["AA", "Aa", "aa"] as const) {
        const result = runPunnettSquareMono({ parentA, parentB });
        if (result.ok)
          expect(
            probabilitiesSumToOne(
              result.output.offspringProbabilities as {
                heterozygous: number;
                homozygousDominant: number;
                homozygousRecessive: number;
              },
            ),
          ).toBeCloseTo(1, 12);
      }
  });
  it("rejects genotypes outside the enum", () =>
    expect(runPunnettSquareMono({ parentA: "AB", parentB: "aa" }).ok).toBe(
      false,
    ));
});
