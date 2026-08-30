import { describe, expect, it } from "vitest";
import {
  lookupTagHeuerRacingHeritage,
  racingHeritageExample,
  runRacingHeritage,
} from "./tool.js";

describe("TAG Heuer racing-chronograph lineage lookup", () => {
  it("reproduces the canonical 1963 Carrera statement", () => {
    expect(runRacingHeritage(racingHeritageExample.input)).toEqual({
      ok: true,
      output: racingHeritageExample.output,
    });
  });

  it("dates the named Autavia collection to 1962", () => {
    expect(
      lookupTagHeuerRacingHeritage({ heritageFocus: "autavia" }).keyDate,
    ).toBe("1962");
  });

  it("dates the Monaco to 1969", () => {
    expect(
      lookupTagHeuerRacingHeritage({ heritageFocus: "monaco" }).keyDate,
    ).toBe("1969");
  });

  it("covers the 1971 Le Mans association", () => {
    expect(
      lookupTagHeuerRacingHeritage({ heritageFocus: "leMans" }).keyDate,
    ).toBe("1971");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runRacingHeritage({ heritageFocus: "FormulaOne" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "heritageFocus" }] },
      ok: false,
    });
  });
});
