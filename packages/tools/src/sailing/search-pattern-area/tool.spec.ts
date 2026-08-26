import { describe, expect, it } from "vitest";
import {
  calculateSearchPatternArea,
  searchPatternAreaExample,
  runSearchPatternArea,
} from "./tool.js";

describe("Search Pattern Area", () => {
  it("publishes an executable example", () =>
    expect(runSearchPatternArea(searchPatternAreaExample.input)).toEqual({
      ok: true,
      output: searchPatternAreaExample.output,
    }));

  it.each([
    [3, 9],
    [2.5, 6.25],
    [1, 1],
    [10, 100],
    [0.5, 0.25],
  ])("squares the side length", (sideLengthNm, expected) => {
    expect(calculateSearchPatternArea({ sideLengthNm })).toEqual({
      patternAreaSqNm: expected,
    });
  });

  it("grows quadratically with the side length", () => {
    const small = calculateSearchPatternArea({
      sideLengthNm: 2,
    })!.patternAreaSqNm;
    const doubled = calculateSearchPatternArea({
      sideLengthNm: 4,
    })!.patternAreaSqNm;
    expect(doubled).toBe(small * 4);
  });

  it.each([[0], [-3]])("rejects non-positive side lengths", (sideLengthNm) => {
    expect(calculateSearchPatternArea({ sideLengthNm })).toBeNull();
    const result = runSearchPatternArea({ sideLengthNm });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_side");
  });

  it("rejects non-finite side lengths at the schema level", () => {
    expect(runSearchPatternArea({ sideLengthNm: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(runSearchPatternArea({ legs: 4, sideLengthNm: 3 })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "legs" }] },
      ok: false,
    });
    expect(runSearchPatternArea(null as never).ok).toBe(false);
  });

  it("keeps tiny positive sides valid", () => {
    expect(runSearchPatternArea({ sideLengthNm: Number.MIN_VALUE }).ok).toBe(
      true,
    );
  });
});
