import { describe, expect, it } from "vitest";
import { anthocyaninContentExample, runAnthocyaninContent } from "./tool.js";

describe("Anthocyanin Content", () => {
  it("publishes an executable example using the default extinction scale", () =>
    expect(runAnthocyaninContent(anthocyaninContentExample.input)).toEqual({
      ok: true,
      output: anthocyaninContentExample.output,
    }));
  it("honours a custom extinction scale", () =>
    expect(
      runAnthocyaninContent({
        correctedAbsorbance: 0.21,
        dryMassG: 0.03,
        extinctionScale: 50,
      }),
    ).toEqual({ ok: true, output: { anthocyaninUgPerG: 350 } }));
  it("returns zero for zero corrected absorbance", () =>
    expect(
      runAnthocyaninContent({ correctedAbsorbance: 0, dryMassG: 0.05 }),
    ).toEqual({
      ok: true,
      output: { anthocyaninUgPerG: 0 },
    }));
  it("supports negative corrected absorbance after upstream correction", () => {
    const result = runAnthocyaninContent({
      correctedAbsorbance: -0.001,
      dryMassG: 2,
    });
    expect(result.ok).toBe(true);
  });
  it("rejects zero dry mass", () =>
    expect(
      runAnthocyaninContent({ correctedAbsorbance: 0.2, dryMassG: 0 }).ok,
    ).toBe(false));
  it("rejects extinction scales outside one to one thousand", () =>
    expect(
      runAnthocyaninContent({
        correctedAbsorbance: 0.2,
        dryMassG: 1,
        extinctionScale: 1001,
      }).ok,
    ).toBe(false));
});
