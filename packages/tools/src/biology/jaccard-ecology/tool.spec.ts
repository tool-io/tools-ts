import { describe, expect, it } from "vitest";
import { jaccardEcologyExample, runJaccardEcology } from "./tool.js";

describe("Jaccard Index", () => {
  it("publishes an executable example", () =>
    expect(runJaccardEcology(jaccardEcologyExample.input)).toEqual({
      ok: true,
      output: jaccardEcologyExample.output,
    }));
  it("reports full similarity for identical communities", () =>
    expect(
      runJaccardEcology({ sharedSpecies: 4, speciesA: 4, speciesB: 4 }),
    ).toEqual({ ok: true, output: { jaccardIndex: 1 } }));
  it("reports zero similarity for disjoint communities", () =>
    expect(
      runJaccardEcology({ sharedSpecies: 0, speciesA: 2, speciesB: 3 }),
    ).toEqual({ ok: true, output: { jaccardIndex: 0 } }));
  it("divides shared species by the union size", () =>
    expect(
      runJaccardEcology({ sharedSpecies: 1, speciesA: 2, speciesB: 3 }),
    ).toEqual({ ok: true, output: { jaccardIndex: 0.25 } }));
  it("rejects shared species above either community", () => {
    const result = runJaccardEcology({
      sharedSpecies: 6,
      speciesA: 5,
      speciesB: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_sets");
  });
  it("rejects an empty union of species", () => {
    const result = runJaccardEcology({
      sharedSpecies: 0,
      speciesA: 0,
      speciesB: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_sets");
  });
  it("rejects negative counts", () => {
    const result = runJaccardEcology({
      sharedSpecies: -1,
      speciesA: 5,
      speciesB: 3,
    });
    expect(result.ok).toBe(false);
  });
});
