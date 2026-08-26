import { describe, expect, it } from "vitest";
import {
  calculateVotingAgePopulationShare,
  runVotingAgePopulationShare,
  votingAgePopulationShareExample,
} from "./tool.js";

describe("demography/voting-age-population-share", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVotingAgePopulationShare(votingAgePopulationShareExample.input),
    ).toEqual({
      ok: true,
      output: votingAgePopulationShareExample.output,
    });
  });

  it("yields one hundred percent when everyone is of voting age", () => {
    expect(
      calculateVotingAgePopulationShare({
        votingAgePopulation: 500,
        totalPopulation: 500,
      }),
    ).toEqual({
      votingAgeSharePercent: 100,
    });
  });

  it("rejects empty totals and vap exceeding total", () => {
    expect(
      runVotingAgePopulationShare({
        votingAgePopulation: 10,
        totalPopulation: 0,
      }).ok,
    ).toBe(false);
    expect(
      runVotingAgePopulationShare({
        votingAgePopulation: 20,
        totalPopulation: 10,
      }).ok,
    ).toBe(false);
  });
});
