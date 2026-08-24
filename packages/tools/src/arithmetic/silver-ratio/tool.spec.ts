import { describe, expect, it } from "vitest";
import { runSilverRatio, silverRatioExample } from "./tool.js";

describe("Silver Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSilverRatio(silverRatioExample.input)).toEqual({
      ok: true,
      output: silverRatioExample.output,
    });
  });

  it("splits a length into silver ratio segments", () => {
    expect(runSilverRatio({ total: 100 })).toEqual({
      ok: true,
      output: { larger: 70.71067811865476, smaller: 29.289321881345245 },
    });
  });

  it("rejects invalid input", () =>
    expect(runSilverRatio(null).ok).toBe(false));
});
