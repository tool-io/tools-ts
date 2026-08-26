import { describe, expect, it } from "vitest";
import { glueApplicationRateExample, runGlueApplicationRate } from "./tool.js";

describe("Glue Application Rate Lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGlueApplicationRate(glueApplicationRateExample.input)).toEqual({
      ok: true,
      output: glueApplicationRateExample.output,
    });
  });

  it("recommends one hundred grams per square metre for two-sided application", () => {
    expect(runGlueApplicationRate({ application: "two-sided" })).toEqual({
      ok: true,
      output: { recommendedGlueGramsPerM2: 100 },
    });
  });

  it("recommends one hundred fifty grams per square metre for one-sided application", () => {
    expect(runGlueApplicationRate({ application: "one-sided" })).toEqual({
      ok: true,
      output: { recommendedGlueGramsPerM2: 150 },
    });
  });

  it("covers every documented application mode", () => {
    for (const application of ["one-sided", "two-sided"] as const) {
      const result = runGlueApplicationRate({ application });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects unknown application modes", () => {
    const result = runGlueApplicationRate({
      application: "three-sided" as never,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects differently cased modes", () => {
    expect(
      runGlueApplicationRate({ application: "One-Sided" as never }).ok,
    ).toBe(false);
  });

  it("requires the application mode", () => {
    expect(runGlueApplicationRate({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runGlueApplicationRate({
      application: "one-sided",
      extra: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runGlueApplicationRate("one-sided").ok).toBe(false);
  });
});
