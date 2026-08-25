import { describe, expect, it } from "vitest";
import { heatIndexApparentExample, runHeatIndexApparent } from "./tool.js";

describe("Heat Index Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runHeatIndexApparent(heatIndexApparentExample.input)).toEqual({
      ok: true,
      output: { apparentTemperatureC: 35.76833429149539 },
    });
  });

  it("equals a vapour free baseline at zero humidity", () => {
    expect(
      runHeatIndexApparent({ relativeHumidityPercent: 0, tempC: 25 }),
    ).toEqual({ ok: true, output: { apparentTemperatureC: 21 } });
  });

  it("raises the apparent temperature with humidity", () => {
    const dry = runHeatIndexApparent({
      relativeHumidityPercent: 20,
      tempC: 32,
    });
    const humid = runHeatIndexApparent({
      relativeHumidityPercent: 90,
      tempC: 32,
    });
    if (!dry.ok || !humid.ok) throw new Error("expected success");
    expect(humid.output.apparentTemperatureC).toBeGreaterThan(
      Number(dry.output.apparentTemperatureC),
    );
  });

  it("uses saturation vapour pressure at one hundred percent humidity", () => {
    const result = runHeatIndexApparent({
      relativeHumidityPercent: 100,
      tempC: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.apparentTemperatureC).toBeCloseTo(
      23.69648462571629,
      10,
    );
  });

  it("accepts the full declared temperature range", () => {
    expect(
      runHeatIndexApparent({ relativeHumidityPercent: 50, tempC: -20 }).ok,
    ).toBe(true);
    expect(
      runHeatIndexApparent({ relativeHumidityPercent: 50, tempC: 60 }).ok,
    ).toBe(true);
  });

  it("rejects temperatures outside the declared range", () => {
    expect(
      runHeatIndexApparent({ relativeHumidityPercent: 50, tempC: 61 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tempC" }] },
      ok: false,
    });
    expect(
      runHeatIndexApparent({ relativeHumidityPercent: 50, tempC: -20.1 }).ok,
    ).toBe(false);
  });

  it("rejects humidity outside zero to one hundred percent", () => {
    expect(
      runHeatIndexApparent({ relativeHumidityPercent: 101, tempC: 30 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "relativeHumidityPercent" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runHeatIndexApparent({
        dewpointC: 20,
        relativeHumidityPercent: 70,
        tempC: 30,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "dewpointC" }] },
      ok: false,
    });
    expect(runHeatIndexApparent(null).ok).toBe(false);
  });
});
