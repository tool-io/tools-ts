import { describe, expect, it } from "vitest";
import { runSeleucidAgConverter, seleucidAgConverterExample } from "./tool.js";

describe("seleucid-ag-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeleucidAgConverter(seleucidAgConverterExample.input)).toEqual({
      ok: true,
      output: seleucidAgConverterExample.output,
    });
  });

  it("maps Seleucid 312 across the BC/AD boundary without a year zero", () => {
    expect(
      runSeleucidAgConverter({
        direction: "seleucid_to_julian",
        year: 312,
        month: 11,
      }),
    ).toEqual({ ok: true, output: { convertedYear: 1, countingEra: "bc" } });
  });

  it("rejects BC dates before the era began", () => {
    expect(
      runSeleucidAgConverter({ direction: "bc_to_seleucid", year: 400 }).ok,
    ).toBe(false);
  });

  it("uses the later Babylonian epoch for its spring convention", () => {
    expect(
      runSeleucidAgConverter({
        direction: "ad_to_seleucid",
        year: 1,
        month: 1,
        newYearConvention: "babylonian_april",
      }),
    ).toEqual({
      ok: true,
      output: { convertedYear: 311, countingEra: "seleucid" },
    });

    expect(
      runSeleucidAgConverter({
        direction: "seleucid_to_julian",
        year: 311,
        month: 1,
        newYearConvention: "babylonian_april",
      }),
    ).toEqual({ ok: true, output: { convertedYear: 1, countingEra: "ad" } });
  });
});
