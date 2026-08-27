import { describe, expect, it } from "vitest";
import {
  calculateUPbConcordia,
  runUPbConcordia,
  uPbConcordiaExample,
} from "./tool.js";

describe("u-pb-concordia", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUPbConcordia(uPbConcordiaExample.input)).toEqual({
      ok: true,
      output: uPbConcordiaExample.output,
    });
  });

  it("reports near-zero discordance for a concordant pair", () => {
    const result = calculateUPbConcordia({
      pb206U238: 1,
      pb207U235: Math.exp(9.8485e-10 * (Math.LN2 / 1.55125e-10)) - 1,
    });
    expect(result.discordancePercent).toBeCloseTo(0, 12);
  });

  it("rejects a zero 207Pb/235U ratio", () => {
    expect(runUPbConcordia({ pb206U238: 1, pb207U235: 0 }).ok).toBe(false);
  });
});
