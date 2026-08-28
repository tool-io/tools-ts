import { describe, expect, it } from "vitest";
import { runZenerCurrent } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runZenerCurrent>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runZenerCurrent>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Zener Current", () => {
  it("computes the Zener current in milliamps", () =>
    expect(
      output(
        runZenerCurrent({
          seriesResistorOhms: 470,
          supplyVolts: 12,
          zenerVolts: 5.1,
        }),
      ).zenerCurrentMa,
    ).toBeCloseTo(14.680851063829788, 9));
  it("computes the Zener current for a decade-friendly divider", () =>
    expect(
      output(
        runZenerCurrent({
          seriesResistorOhms: 690,
          supplyVolts: 12,
          zenerVolts: 5.1,
        }),
      ).zenerCurrentMa,
    ).toBeCloseTo(10, 9));
  it("computes the Zener current for a 12V Zener on a 24V supply", () =>
    expect(
      output(
        runZenerCurrent({
          seriesResistorOhms: 1000,
          supplyVolts: 24,
          zenerVolts: 12,
        }),
      ).zenerCurrentMa,
    ).toBeCloseTo(12, 9));
  it("reports insufficient supply when supply equals Zener voltage", () => {
    const result = runZenerCurrent({
      seriesResistorOhms: 470,
      supplyVolts: 5.1,
      zenerVolts: 5.1,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("insufficient_supply");
  });
  it("reports insufficient supply when supply is below Zener voltage", () => {
    const result = runZenerCurrent({
      seriesResistorOhms: 470,
      supplyVolts: 3,
      zenerVolts: 5.1,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("insufficient_supply");
  });
  it("rejects a zero series resistor", () => {
    const result = runZenerCurrent({
      seriesResistorOhms: 0,
      supplyVolts: 12,
      zenerVolts: 5.1,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative series resistor", () =>
    expect(
      runZenerCurrent({
        seriesResistorOhms: -470,
        supplyVolts: 12,
        zenerVolts: 5.1,
      }).ok,
    ).toBe(false));
});
