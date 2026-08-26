import { describe, expect, it } from "vitest";
import {
  hematocritPercentageExample,
  runHematocritPercentage,
} from "./tool.js";

describe("Hematocrit %", () => {
  it("publishes an executable example", () =>
    expect(runHematocritPercentage(hematocritPercentageExample.input)).toEqual({
      ok: true,
      output: hematocritPercentageExample.output,
    }));
  it("computes a mid-range ratio", () =>
    expect(
      runHematocritPercentage({ bloodSampleMl: 10, rbcVolumeMl: 4.5 }),
    ).toEqual({ ok: true, output: { hematocritPercent: 45 } }));
  it("accepts zero red cell volume", () =>
    expect(
      runHematocritPercentage({ bloodSampleMl: 8, rbcVolumeMl: 0 }),
    ).toEqual({ ok: true, output: { hematocritPercent: 0 } }));
  it("accepts equal volumes as one hundred percent", () =>
    expect(
      runHematocritPercentage({ bloodSampleMl: 7, rbcVolumeMl: 7 }),
    ).toEqual({ ok: true, output: { hematocritPercent: 100 } }));
  it("keeps fractional precision", () =>
    expect(
      runHematocritPercentage({ bloodSampleMl: 3, rbcVolumeMl: 1 }),
    ).toEqual({ ok: true, output: { hematocritPercent: 33.33333333333333 } }));
  it("rejects zero sample volume", () => {
    const result = runHematocritPercentage({
      bloodSampleMl: 0,
      rbcVolumeMl: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("bloodSampleMl");
  });
  it("rejects negative sample volume", () => {
    const result = runHematocritPercentage({
      bloodSampleMl: -5,
      rbcVolumeMl: 1,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects red cell volume above sample volume", () => {
    const result = runHematocritPercentage({
      bloodSampleMl: 4,
      rbcVolumeMl: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("rbcVolumeMl");
  });
});
