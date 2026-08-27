import { describe, expect, it } from "vitest";
import { runSimpsonEvenness, simpsonEvennessExample } from "./tool.js";

describe("Simpson Evenness", () => {
  it("publishes an executable example", () =>
    expect(runSimpsonEvenness(simpsonEvennessExample.input)).toEqual({
      ok: true,
      output: simpsonEvennessExample.output,
    }));
  it("is one when D is the reciprocal species count", () =>
    expect(runSimpsonEvenness({ dIndex: 0.25, speciesCountInt: 4 })).toEqual({
      ok: true,
      output: { simpsonEvenness: 1 },
    }));
  it("scales inverse concentration by species count", () =>
    expect(runSimpsonEvenness({ dIndex: 0.4, speciesCountInt: 5 })).toEqual({
      ok: true,
      output: { simpsonEvenness: 0.5 },
    }));
  it("allows a single species with small concentration", () =>
    expect(runSimpsonEvenness({ dIndex: 0.25, speciesCountInt: 1 })).toEqual({
      ok: true,
      output: { simpsonEvenness: 4 },
    }));
  it("rejects zero concentration", () => {
    const result = runSimpsonEvenness({
      dIndex: 0,
      speciesCountInt: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_index");
  });
  it("rejects unit concentration", () =>
    expect(runSimpsonEvenness({ dIndex: 1, speciesCountInt: 4 }).ok).toBe(
      false,
    ));
  it("rejects concentration above one", () =>
    expect(runSimpsonEvenness({ dIndex: 1.5, speciesCountInt: 4 }).ok).toBe(
      false,
    ));
  it("rejects zero species", () =>
    expect(runSimpsonEvenness({ dIndex: 0.25, speciesCountInt: 0 }).ok).toBe(
      false,
    ));
});
