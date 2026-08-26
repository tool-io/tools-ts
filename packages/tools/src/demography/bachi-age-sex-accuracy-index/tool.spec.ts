import { describe, expect, it } from "vitest";
import { bachiAgeSexAccuracyExample, runBachiAgeSexAccuracy } from "./tool.js";

describe("bachi-age-sex-accuracy-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBachiAgeSexAccuracy(bachiAgeSexAccuracyExample.input)).toEqual({
      ok: true,
      output: bachiAgeSexAccuracyExample.output,
    });
  });

  it("scores zero when digits are perfectly balanced in both sexes", () => {
    const r = runBachiAgeSexAccuracy({
      maleBySingleAge: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      femaleBySingleAge: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
      startAge: 30,
    });
    expect(r.ok && r.output.bachiAgeSexAccuracyIndex).toBe(0);
  });

  it("rejects spans that are not whole decades", () => {
    expect(
      runBachiAgeSexAccuracy({
        maleBySingleAge: [10, 10, 10],
        femaleBySingleAge: [10, 10, 10],
        startAge: 20,
      }).ok,
    ).toBe(false);
  });
});
