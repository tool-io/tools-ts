import { describe, expect, it } from "vitest";
import { hillN0Example, runHillN0 } from "./tool.js";

describe("Hill Number N0", () => {
  it("publishes an executable example", () =>
    expect(runHillN0(hillN0Example.input)).toEqual({
      ok: true,
      output: hillN0Example.output,
    }));
  it("passes richness through unchanged", () =>
    expect(runHillN0({ speciesCountInt: 42 })).toEqual({
      ok: true,
      output: { hillN0: 42 },
    }));
  it("returns zero for an empty community", () =>
    expect(runHillN0({ speciesCountInt: 0 })).toEqual({
      ok: true,
      output: { hillN0: 0 },
    }));
  it("accepts the smallest positive community", () =>
    expect(runHillN0({ speciesCountInt: 1 })).toEqual({
      ok: true,
      output: { hillN0: 1 },
    }));
  it("rejects negative counts", () =>
    expect(runHillN0({ speciesCountInt: -1 }).ok).toBe(false));
  it("rejects non-integers", () =>
    expect(runHillN0({ speciesCountInt: 1.5 }).ok).toBe(false));
});
