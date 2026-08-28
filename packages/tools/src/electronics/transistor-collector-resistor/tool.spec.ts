import { describe, expect, it } from "vitest";
import { runTransistorCollectorResistor } from "./tool.js";

const firstIssueCode = (
  result: ReturnType<typeof runTransistorCollectorResistor>,
) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runTransistorCollectorResistor>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Collector Resistor Value", () => {
  it("computes the collector resistor using the default 0.2V saturation", () =>
    expect(
      output(
        runTransistorCollectorResistor({
          collectorCurrentMa: 10,
          supplyVolts: 12,
        }),
      ).collectorResistorOhms,
    ).toBeCloseTo(1180, 6));
  it("computes the collector resistor with an explicit saturation voltage", () =>
    expect(
      output(
        runTransistorCollectorResistor({
          collectorCurrentMa: 20,
          saturationVolts: 0.2,
          supplyVolts: 5,
        }),
      ).collectorResistorOhms,
    ).toBeCloseTo(240, 6));
  it("computes the collector resistor for a 3.3V rail", () =>
    expect(
      output(
        runTransistorCollectorResistor({
          collectorCurrentMa: 5,
          saturationVolts: 0.1,
          supplyVolts: 3.3,
        }),
      ).collectorResistorOhms,
    ).toBeCloseTo(640, 6));
  it("reports an invalid supply when supply equals saturation voltage", () => {
    const result = runTransistorCollectorResistor({
      collectorCurrentMa: 1,
      saturationVolts: 5,
      supplyVolts: 5,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_supply");
  });
  it("reports an invalid supply when supply is below saturation voltage", () => {
    const result = runTransistorCollectorResistor({
      collectorCurrentMa: 1,
      saturationVolts: 2,
      supplyVolts: 1,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_supply");
  });
  it("rejects a zero collector current", () => {
    const result = runTransistorCollectorResistor({
      collectorCurrentMa: 0,
      supplyVolts: 12,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative collector current", () =>
    expect(
      runTransistorCollectorResistor({
        collectorCurrentMa: -10,
        supplyVolts: 12,
      }).ok,
    ).toBe(false));
});
