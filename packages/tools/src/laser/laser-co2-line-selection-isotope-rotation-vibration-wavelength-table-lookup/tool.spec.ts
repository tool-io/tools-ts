import { describe, expect, it } from "vitest";
import {
  co2LineExample as example,
  co2LineLookup,
  runCo2Line,
} from "./tool.js";

describe("CO2 line selection table", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCo2Line(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("separates the 10.6 and 9.6 bands by about 1 µm", () => {
    const ten = co2LineLookup({ line: "band-10p6" });
    const nine = co2LineLookup({ line: "band-9p6" });
    expect(ten.wavelengthUm - nine.wavelengthUm).toBeCloseTo(1, 12);
    expect(ten.isotopologue).toBe("12C16O2");
  });
  it("rejects undocumented lines", () =>
    expect(runCo2Line({ line: "10P99" }).ok).toBe(false));
});
