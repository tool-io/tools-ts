import { describe, expect, it } from "vitest";
import { margalefRichnessExample, runMargalefRichness } from "./tool.js";

describe("Margalef Richness", () => {
  it("matches the canonical example", () => {
    expect(runMargalefRichness(margalefRichnessExample.input)).toEqual({
      ok: true,
      output: margalefRichnessExample.output,
    });
  });

  it("returns zero for a single species community", () => {
    expect(
      runMargalefRichness({ speciesCountInt: 1, totalIndividualsInt: 50 }),
    ).toEqual({ ok: true, output: { margalefRichnessIndex: 0 } });
  });

  it("computes the two individual two species index exactly", () => {
    expect(
      runMargalefRichness({ speciesCountInt: 2, totalIndividualsInt: 2 }),
    ).toEqual({
      ok: true,
      output: { margalefRichnessIndex: 1.4426950408889634 },
    });
  });

  it("computes another exact value", () => {
    expect(
      runMargalefRichness({ speciesCountInt: 5, totalIndividualsInt: 10 }),
    ).toEqual({
      ok: true,
      output: { margalefRichnessIndex: 1.737177927613007 },
    });
  });

  it("rejects one or fewer individuals with a stable code", () => {
    const one = runMargalefRichness({
      speciesCountInt: 3,
      totalIndividualsInt: 1,
    });
    const zero = runMargalefRichness({
      speciesCountInt: 3,
      totalIndividualsInt: 0,
    });
    const negative = runMargalefRichness({
      speciesCountInt: 3,
      totalIndividualsInt: -4,
    });
    expect(one.ok).toBe(false);
    expect(zero.ok).toBe(false);
    expect(negative.ok).toBe(false);
    if (!one.ok)
      expect(one.error.issues[0]).toMatchObject({
        code: "insufficient_individuals",
        field: "totalIndividualsInt",
      });
  });

  it("rejects zero species through the schema", () => {
    const result = runMargalefRichness({
      speciesCountInt: 0,
      totalIndividualsInt: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "speciesCountInt",
      });
  });

  it("rejects fractional counts through the schema", () => {
    expect(
      runMargalefRichness({
        speciesCountInt: 2.5,
        totalIndividualsInt: 50,
      }).ok,
    ).toBe(false);
    expect(
      runMargalefRichness({
        speciesCountInt: 5,
        totalIndividualsInt: 49.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and missing required input", () => {
    const extra = runMargalefRichness({
      speciesCountInt: 8,
      totalIndividualsInt: 120,
      quadrats: 4,
    });
    if (!extra.ok)
      expect(extra.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "quadrats",
      });
    expect(runMargalefRichness({ speciesCountInt: 8 }).ok).toBe(false);
  });
});
