import { describe, expect, it } from "vitest";
import {
  ellYardRegionalConverterExample,
  runEllYardRegionalConverter,
} from "./tool.js";

describe("ell-yard-regional-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEllYardRegionalConverter(ellYardRegionalConverterExample.input),
    ).toEqual({ ok: true, output: ellYardRegionalConverterExample.output });
  });

  it("converts Flemish ells to a fractional yard count", () => {
    expect(
      runEllYardRegionalConverter({
        value: 4,
        unit: "ell",
        region: "flemish_ell_27in",
      }),
    ).toEqual({
      ok: true,
      output: { totalInches: 108, yards: 3, ells: 4 },
    });
  });

  it("rejects a non-positive custom ell", () => {
    expect(
      runEllYardRegionalConverter({
        value: 1,
        region: "custom_inches",
        customEllInches: 0,
      }).ok,
    ).toBe(false);
  });
});
