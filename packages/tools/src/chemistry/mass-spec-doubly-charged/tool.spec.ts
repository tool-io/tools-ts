import { describe, expect, it } from "vitest";
import {
  massSpecDoublyChargedExample,
  runMassSpecDoublyCharged,
} from "./tool.js";
describe("Doubly Charged m/z", () => {
  it("publishes an executable example", () =>
    expect(
      runMassSpecDoublyCharged(massSpecDoublyChargedExample.input),
    ).toEqual({
      ok: true,
      output: massSpecDoublyChargedExample.output,
    }));
  it("matches the general formula at charge two", () =>
    expect(runMassSpecDoublyCharged({ massDa: 1000 })).toEqual({
      ok: true,
      output: { doublyChargedMz: 501.007276 },
    }));
  it("adds half a dalton per extra dalton of mass", () =>
    expect(runMassSpecDoublyCharged({ massDa: 1001 })).toEqual({
      ok: true,
      output: { doublyChargedMz: 501.507276 },
    }));
  it("matches a small peptide ion closely", () => {
    const result = runMassSpecDoublyCharged({ massDa: 573.31 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.doublyChargedMz).toBeCloseTo(287.662276, 6);
  });
  it("rejects zero mass", () =>
    expect(runMassSpecDoublyCharged({ massDa: 0 }).ok).toBe(false));
  it("rejects negative mass", () =>
    expect(runMassSpecDoublyCharged({ massDa: -180 }).ok).toBe(false));
  it("rejects non-finite mass", () =>
    expect(
      runMassSpecDoublyCharged({ massDa: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false));
});
