import { describe, expect, it } from "vitest";
import { runShuntFraction, shuntFractionExample } from "./tool.js";

describe("Shunt Fraction %", () => {
  it("publishes an executable example", () =>
    expect(runShuntFraction(shuntFractionExample.input)).toEqual({
      ok: true,
      output: shuntFractionExample.output,
    }));
  it("computes a large shunt", () =>
    expect(
      runShuntFraction({ caO2Content: 12, cco2Content: 20, cvO2Content: 18 }),
    ).toEqual({ ok: true, output: { shuntFractionPercent: 400 } }));
  it("returns zero for equal arterial and end-capillary contents", () =>
    expect(
      runShuntFraction({ caO2Content: 20, cco2Content: 20, cvO2Content: 15 }),
    ).toEqual({ ok: true, output: { shuntFractionPercent: 0 } }));
  it("reports signed results when contents invert", () =>
    expect(
      runShuntFraction({ caO2Content: 21, cco2Content: 20, cvO2Content: 15 }),
    ).toEqual({ ok: true, output: { shuntFractionPercent: -20 } }));
  it("keeps fractional precision", () =>
    expect(
      runShuntFraction({ caO2Content: 18, cco2Content: 19.5, cvO2Content: 15 }),
    ).toEqual({
      ok: true,
      output: { shuntFractionPercent: 33.33333333333333 },
    }));
  it("rejects equal end-capillary and venous contents", () => {
    const result = runShuntFraction({
      caO2Content: 19,
      cco2Content: 20,
      cvO2Content: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("equal_contents");
  });
  it("rejects unknown fields", () => {
    const result = runShuntFraction({
      caO2Content: 19,
      cco2Content: 20,
      cvO2Content: 15,
      unit: "mL/dL",
    });
    expect(result.ok).toBe(false);
  });
});
