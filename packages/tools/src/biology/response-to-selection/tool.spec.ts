import { describe, expect, it } from "vitest";
import { runResponseToSelection } from "./tool.js";

describe("Response To Selection", () => {
  it("applies the breeder's equation", () =>
    expect(
      runResponseToSelection({ h2Number: 0.5, selectionDifferenceS: 4 }),
    ).toEqual({ ok: true, output: { responseR: 2 } }));
  it("returns a signed response for downward selection", () =>
    expect(
      runResponseToSelection({ h2Number: 0.5, selectionDifferenceS: -2 }),
    ).toEqual({ ok: true, output: { responseR: -1 } }));
  it("yields zero for zero heritability", () =>
    expect(
      runResponseToSelection({ h2Number: 0, selectionDifferenceS: 9 }),
    ).toEqual({ ok: true, output: { responseR: 0 } }));
  it("passes the full differential at unit heritability", () =>
    expect(
      runResponseToSelection({ h2Number: 1, selectionDifferenceS: 6 }),
    ).toEqual({ ok: true, output: { responseR: 6 } }));
  it("yields zero for zero selection pressure", () =>
    expect(
      runResponseToSelection({ h2Number: 0.8, selectionDifferenceS: 0 }),
    ).toEqual({ ok: true, output: { responseR: 0 } }));
  it("handles fractional heritability", () =>
    expect(
      runResponseToSelection({ h2Number: 0.25, selectionDifferenceS: 8 }),
    ).toEqual({ ok: true, output: { responseR: 2 } }));
  it("rejects out of range heritability", () => {
    const result = runResponseToSelection({
      h2Number: 1.5,
      selectionDifferenceS: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
