import { describe, expect, it } from "vitest";
import { mgNumberVsSilicaExample, runMgNumberVsSilica } from "./tool.js";

describe("mg-number-vs-silica", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMgNumberVsSilica(mgNumberVsSilicaExample.input)).toEqual({
      ok: true,
      output: mgNumberVsSilicaExample.output,
    });
  });

  it("gives Mg number 100 for iron-free compositions", () => {
    const r = runMgNumberVsSilica({
      mgoWtPercent: 10,
      feOWtPercent: 0,
      fe2O3WtPercent: 0,
      siO2WtPercent: 45,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.mgNumberMolar as number).toBe(100);
  });
  it("rejects zero or negative oxides", () => {
    expect(
      runMgNumberVsSilica({ ...mgNumberVsSilicaExample.input, mgoWtPercent: 0 })
        .ok,
    ).toBe(false);
  });
});
