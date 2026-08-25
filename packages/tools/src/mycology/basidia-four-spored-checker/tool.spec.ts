import { describe, expect, it } from "vitest";
import {
  basidiaFourSporedCheckerExample,
  runBasidiaFourSporedChecker,
} from "./tool.js";

describe("Basidia Spored Checker", () => {
  it("matches the canonical example", () => {
    expect(
      runBasidiaFourSporedChecker(basidiaFourSporedCheckerExample.input),
    ).toEqual({
      ok: true,
      output: basidiaFourSporedCheckerExample.output,
    });
  });
  it("reports two-spored basidia as not four-spored", () =>
    expect(runBasidiaFourSporedChecker({ sporesPerBasidium: 2 })).toEqual({
      ok: true,
      output: { isFourSpored: false, observedSporeCount: 2 },
    }));
  it("reports one-spored basidia", () =>
    expect(runBasidiaFourSporedChecker({ sporesPerBasidium: 1 })).toEqual({
      ok: true,
      output: { isFourSpored: false, observedSporeCount: 1 },
    }));
  it("accepts an eight-spored observation", () =>
    expect(runBasidiaFourSporedChecker({ sporesPerBasidium: 8 })).toEqual({
      ok: true,
      output: { isFourSpored: false, observedSporeCount: 8 },
    }));
  it("rejects zero spores", () =>
    expect(runBasidiaFourSporedChecker({ sporesPerBasidium: 0 }).ok).toBe(
      false,
    ));
  it("does not impose an arbitrary eight-spore ceiling", () =>
    expect(runBasidiaFourSporedChecker({ sporesPerBasidium: 9 })).toEqual({
      ok: true,
      output: { isFourSpored: false, observedSporeCount: 9 },
    }));
  it("rejects fractional spore counts", () =>
    expect(runBasidiaFourSporedChecker({ sporesPerBasidium: 3.5 }).ok).toBe(
      false,
    ));
});
