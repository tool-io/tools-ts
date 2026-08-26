import { describe, expect, it } from "vitest";
import {
  calculateMmrMaternalMortalityRatio,
  runMmrMaternalMortalityRatio,
  mmrMaternalMortalityRatioExample,
} from "./tool.js";

describe("demography/mmr-maternal-mortality-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMmrMaternalMortalityRatio(mmrMaternalMortalityRatioExample.input),
    ).toEqual({
      ok: true,
      output: mmrMaternalMortalityRatioExample.output,
    });
  });

  it("matches the direct per-100000 scaling", () => {
    expect(
      calculateMmrMaternalMortalityRatio({
        maternalDeaths: 7,
        liveBirths: 10000,
      }),
    ).toEqual({
      maternalMortalityRatio: 70,
    });
  });

  it("rejects non-positive births or negative deaths", () => {
    expect(
      runMmrMaternalMortalityRatio({ maternalDeaths: 5, liveBirths: 0 }).ok,
    ).toBe(false);
    expect(
      runMmrMaternalMortalityRatio({ maternalDeaths: -2, liveBirths: 100 }).ok,
    ).toBe(false);
  });
});
