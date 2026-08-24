import { describe, expect, it } from "vitest";
import { arrheniusMtbfExample as example, runArrheniusMtbf } from "./tool.js";
describe("Arrhenius MTBF projection", () => {
  it("reproduces its temperature-acceleration example", () =>
    expect(runArrheniusMtbf(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("requires stress temperature above use temperature", () =>
    expect(
      runArrheniusMtbf({
        eaEv: 0.45,
        mtbfHoursStress: 1000,
        tStressC: 40,
        tUseC: 45,
      }).ok,
    ).toBe(false));
});
