import { describe, expect, it } from "vitest";
import { runSpeciesRichness, speciesRichnessExample } from "./tool.js";

describe("Species Richness", () => {
  it("publishes an executable example", () =>
    expect(runSpeciesRichness(speciesRichnessExample.input)).toEqual({
      ok: true,
      output: speciesRichnessExample.output,
    }));
  it("passes through the distinct species count", () =>
    expect(runSpeciesRichness({ distinctSpeciesCount: 42 })).toEqual({
      ok: true,
      output: { speciesRichness: 42 },
    }));
  it("allows an empty community", () =>
    expect(runSpeciesRichness({ distinctSpeciesCount: 0 })).toEqual({
      ok: true,
      output: { speciesRichness: 0 },
    }));
  it("rejects negative counts", () => {
    const result = runSpeciesRichness({ distinctSpeciesCount: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects non-integer counts", () => {
    const result = runSpeciesRichness({ distinctSpeciesCount: 3.5 });
    expect(result.ok).toBe(false);
  });
  it("rejects missing input", () => {
    const result = runSpeciesRichness({});
    expect(result.ok).toBe(false);
  });
});
