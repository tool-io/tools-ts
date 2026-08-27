import { describe, expect, it } from "vitest";
import { runSorensenEcology } from "./tool.js";

describe("Sorensen Index", () => {
  it("calculates a valid result", () =>
    expect(
      runSorensenEcology({ sharedSpecies: 6, speciesA: 10, speciesB: 12 }),
    ).toEqual({
      ok: true,
      output: { sorensenIndex: 0.5454545454545454 },
    }));
  it("returns one for identical communities", () => {
    const result = runSorensenEcology({
      sharedSpecies: 8,
      speciesA: 8,
      speciesB: 8,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.sorensenIndex).toBe(1);
  });
  it("returns zero with no shared species", () => {
    const result = runSorensenEcology({
      sharedSpecies: 0,
      speciesA: 5,
      speciesB: 7,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.sorensenIndex).toBe(0);
  });
  it("is symmetric in community order", () => {
    const ab = runSorensenEcology({
      sharedSpecies: 6,
      speciesA: 10,
      speciesB: 12,
    });
    const ba = runSorensenEcology({
      sharedSpecies: 6,
      speciesA: 12,
      speciesB: 10,
    });
    expect(ab).toEqual(ba);
  });
  it("rejects negative shared species", () =>
    expect(
      runSorensenEcology({ sharedSpecies: -1, speciesA: 10, speciesB: 12 }).ok,
    ).toBe(false));
  it("rejects shared exceeding the smaller count", () =>
    expect(
      runSorensenEcology({ sharedSpecies: 11, speciesA: 10, speciesB: 12 }).ok,
    ).toBe(false));
  it("rejects a zero denominator", () =>
    expect(
      runSorensenEcology({ sharedSpecies: 0, speciesA: 0, speciesB: 0 }).ok,
    ).toBe(false));
  it("rejects negative community counts", () =>
    expect(
      runSorensenEcology({ sharedSpecies: 1, speciesA: -3, speciesB: 2 }).ok,
    ).toBe(false));
});
