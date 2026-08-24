import { describe, expect, it } from "vitest";
import {
  regnalEnglishYearConverterExample,
  runRegnalEnglishYearConverter,
} from "./tool.js";

describe("regnal-english-year-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRegnalEnglishYearConverter(regnalEnglishYearConverterExample.input),
    ).toEqual({
      ok: true,
      output: regnalEnglishYearConverterExample.output,
    });
  });

  it("gives Richard III's first year its documented span", () => {
    const result = runRegnalEnglishYearConverter({
      monarch: "richard_iii",
      regnalYear: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.regnalYearStart).toBe("1483-06-26");
    expect(result.output.regnalYearEnd).toBe("1484-06-25");
  });

  it("rejects regnal years beyond the reign", () => {
    expect(
      runRegnalEnglishYearConverter({ monarch: "elizabeth_i", regnalYear: 46 })
        .ok,
    ).toBe(false);
  });

  it("caps the final regnal year on the end of the reign", () => {
    const result = runRegnalEnglishYearConverter({
      monarch: "elizabeth_i",
      regnalYear: 45,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.regnalYearStart).toBe("1602-11-17");
    expect(result.output.regnalYearEnd).toBe("1603-03-24");
  });
});
