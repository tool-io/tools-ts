import { describe, expect, it } from "vitest";
import { runMorelSoilDegreeDayAccumulator } from "./tool.js";
describe("Morel Degree Days", () => {
  it("accumulates degree days above the default threshold", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({ daysElapsedInt: 5, soilTempC: 14 }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 20 } }));
  it("clamps subthreshold temperatures to zero", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 10,
        soilTempC: 5,
      }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 0 } }));
  it("yields zero at exactly the threshold", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 3,
        soilTempC: 10,
      }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 0 } }));
  it("honors a custom threshold", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 4,
        soilTempC: 10,
        thresholdC: 5,
      }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 20 } }));
  it("clamps the coldest allowed temperature to zero", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 6,
        soilTempC: -10,
      }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 0 } }));
  it("handles the hottest allowed temperature", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 3,
        soilTempC: 40,
      }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 90 } }));
  it("supports single day accumulation", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 1,
        soilTempC: 20,
      }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 10 } }));
  it("rejects zero elapsed days", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({ daysElapsedInt: 0, soilTempC: 20 }).ok,
    ).toBe(false));
  it("does not impose an arbitrary forty-degree ceiling", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({ daysElapsedInt: 2, soilTempC: 41 }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 62 } }));
  it("accepts temperatures below minus ten degrees", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({ daysElapsedInt: 2, soilTempC: -11 }),
    ).toEqual({ ok: true, output: { accumulatedDegreeDays: 0 } }));
  it("rejects temperatures below absolute zero", () =>
    expect(
      runMorelSoilDegreeDayAccumulator({
        daysElapsedInt: 2,
        soilTempC: -273.16,
      }).ok,
    ).toBe(false));
});
