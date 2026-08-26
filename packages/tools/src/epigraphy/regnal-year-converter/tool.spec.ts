import { describe, expect, it } from "vitest";
import {
  calculateRegnalYearConverter,
  regnalYearConverterExample,
  runRegnalYearConverter,
} from "./tool.js";

describe("epigraphy/regnal-year-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRegnalYearConverter(regnalYearConverterExample.input)).toEqual({
      ok: true,
      output: regnalYearConverterExample.output,
    });
  });

  it("counts forward within an AD accession", () => {
    expect(
      calculateRegnalYearConverter({ regnalYear: 5, accessionYear: 30 }),
    ).toEqual({ era: "AD", year: 34 });
  });

  it("crosses the BC/AD boundary inclusively", () => {
    expect(
      calculateRegnalYearConverter({
        regnalYear: 10,
        accessionYear: 4,
        accessionEra: "BC",
      }),
    ).toEqual({ era: "AD", year: 6 });
    expect(
      calculateRegnalYearConverter({
        regnalYear: 4,
        accessionYear: 4,
        accessionEra: "BC",
      }),
    ).toEqual({ era: "BC", year: 1 });
  });

  it("rejects zero or negative counts", () => {
    expect(
      runRegnalYearConverter({ regnalYear: 0, accessionYear: 27 }).ok,
    ).toBe(false);
    expect(runRegnalYearConverter({ regnalYear: 2, accessionYear: 0 }).ok).toBe(
      false,
    );
  });
});
