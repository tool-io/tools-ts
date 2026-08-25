import { describe, expect, it } from "vitest";
import { runFruitingHumidityRangeComplianceChecker } from "./tool.js";
describe("Humidity Compliance", () => {
  const targets = {
    maximumTargetHumidityPercent: 95,
    minimumTargetHumidityPercent: 85,
  };
  it("is compliant mid band", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 90,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 90, withinTargetRange: true },
    }));
  it("is compliant at the lower bound", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 85,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 85, withinTargetRange: true },
    }));
  it("is compliant at the upper bound", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 95,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 95, withinTargetRange: true },
    }));
  it("is non compliant just below the band", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 84.9,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 84.9, withinTargetRange: false },
    }));
  it("is non compliant just above the band", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 95.1,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 95.1, withinTargetRange: false },
    }));
  it("is non compliant at the driest allowed level", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 20,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 20, withinTargetRange: false },
    }));
  it("is non compliant at the wettest allowed level", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 100,
      }),
    ).toEqual({
      ok: true,
      output: { relativeHumidityPercent: 100, withinTargetRange: false },
    }));
  it("rejects humidity below twenty percent", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: -1,
      }).ok,
    ).toBe(false));
  it("rejects humidity above one hundred percent", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        ...targets,
        humidityPercent: 101,
      }).ok,
    ).toBe(false));
  it("rejects a reversed target range", () =>
    expect(
      runFruitingHumidityRangeComplianceChecker({
        humidityPercent: 90,
        maximumTargetHumidityPercent: 85,
        minimumTargetHumidityPercent: 95,
      }).ok,
    ).toBe(false));
});
