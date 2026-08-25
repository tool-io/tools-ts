import { describe, expect, it } from "vitest";
import {
  bergerParkerDominanceExample,
  runBergerParkerDominance,
} from "./tool.js";

describe("Berger-Parker Dominance", () => {
  it("matches the canonical example", () => {
    expect(
      runBergerParkerDominance(bergerParkerDominanceExample.input),
    ).toEqual({
      ok: true,
      output: bergerParkerDominanceExample.output,
    });
  });

  it("reports full dominance when one species makes up the community", () => {
    expect(
      runBergerParkerDominance({
        mostAbundantCount: 100,
        totalIndividualsInt: 100,
      }),
    ).toEqual({ ok: true, output: { bergerParkerDominance: 1 } });
  });

  it("computes a half dominance exactly", () => {
    expect(
      runBergerParkerDominance({
        mostAbundantCount: 25,
        totalIndividualsInt: 50,
      }),
    ).toEqual({ ok: true, output: { bergerParkerDominance: 0.5 } });
  });

  it("allows a zero abundance", () => {
    expect(
      runBergerParkerDominance({
        mostAbundantCount: 0,
        totalIndividualsInt: 50,
      }),
    ).toEqual({ ok: true, output: { bergerParkerDominance: 0 } });
  });

  it("rejects abundance above total with a stable code", () => {
    const result = runBergerParkerDominance({
      mostAbundantCount: 101,
      totalIndividualsInt: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_counts",
        field: "mostAbundantCount",
      });
  });

  it("rejects a zero total through the schema", () => {
    const result = runBergerParkerDominance({
      mostAbundantCount: 35,
      totalIndividualsInt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "totalIndividualsInt",
      });
  });

  it("rejects negative and fractional counts through the schema", () => {
    expect(
      runBergerParkerDominance({
        mostAbundantCount: -1,
        totalIndividualsInt: 100,
      }).ok,
    ).toBe(false);
    expect(
      runBergerParkerDominance({
        mostAbundantCount: 35.5,
        totalIndividualsInt: 100,
      }).ok,
    ).toBe(false);
    expect(
      runBergerParkerDominance({
        mostAbundantCount: 35,
        totalIndividualsInt: 99.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non object input and missing required fields", () => {
    expect(runBergerParkerDominance("x").ok).toBe(false);
    expect(runBergerParkerDominance({ totalIndividualsInt: 10 }).ok).toBe(
      false,
    );
  });
});
