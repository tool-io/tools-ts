import { describe, expect, it } from "vitest";
import { runWindChillApparent, windChillApparentExample } from "./tool.js";

describe("Wind Chill Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runWindChillApparent(windChillApparentExample.input)).toEqual({
      ok: true,
      output: { apparentTemperatureC: -12.996724811921073 },
    });
  });

  it("matches the reference value at the formula calibration point", () => {
    const result = runWindChillApparent({ tempC: 5, windSpeedKph: 20 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.apparentTemperatureC).toBeCloseTo(
      1.0669572525115663,
      10,
    );
  });

  it("cools the apparent temperature as wind increases", () => {
    const calm = runWindChillApparent({ tempC: -10, windSpeedKph: 5 });
    const windy = runWindChillApparent({ tempC: -10, windSpeedKph: 60 });
    if (!calm.ok || !windy.ok) throw new Error("expected success");
    expect(windy.output.apparentTemperatureC).toBeLessThan(
      Number(calm.output.apparentTemperatureC),
    );
  });

  it("accepts the domain boundary of ten degrees and minimum wind", () => {
    expect(runWindChillApparent({ tempC: 10, windSpeedKph: 4.8 }).ok).toBe(
      true,
    );
  });

  it("reports not applicable above ten degrees Celsius", () => {
    expect(runWindChillApparent({ tempC: 11, windSpeedKph: 20 })).toMatchObject(
      {
        error: { issues: [{ code: "not_applicable", field: "tempC" }] },
        ok: false,
      },
    );
  });

  it("reports not applicable below four point eight kilometres per hour", () => {
    expect(
      runWindChillApparent({ tempC: -5, windSpeedKph: 4.7 }),
    ).toMatchObject({
      error: { issues: [{ code: "not_applicable", field: "windSpeedKph" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    expect(
      runWindChillApparent({ tempC: Number.NaN, windSpeedKph: 20 }).ok,
    ).toBe(false);
    expect(
      runWindChillApparent({
        tempC: -5,
        windSpeedKph: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runWindChillApparent({ humidity: 60, tempC: -5, windSpeedKph: 30 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "humidity" }] },
      ok: false,
    });
    expect(runWindChillApparent(null).ok).toBe(false);
  });
});
