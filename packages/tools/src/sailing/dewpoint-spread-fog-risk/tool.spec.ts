import { describe, expect, it } from "vitest";
import {
  dewpointSpreadFogRiskExample,
  runDewpointSpreadFogRisk,
} from "./tool.js";

describe("Fog Risk Spread Check", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runDewpointSpreadFogRisk(dewpointSpreadFogRiskExample.input),
    ).toEqual({ ok: true, output: { fogRisk: true, spreadCelsius: 1.5 } });
  });

  it("flags fog risk at exactly two degrees of spread", () => {
    expect(runDewpointSpreadFogRisk({ dewpointC: 8, tempC: 10 })).toEqual({
      ok: true,
      output: { fogRisk: true, spreadCelsius: 2 },
    });
  });

  it("clears fog risk above two degrees of spread", () => {
    expect(runDewpointSpreadFogRisk({ dewpointC: 8, tempC: 10.5 })).toEqual({
      ok: true,
      output: { fogRisk: false, spreadCelsius: 2.5 },
    });
  });

  it("handles negative temperature spreads below freezing", () => {
    expect(runDewpointSpreadFogRisk({ dewpointC: -12.5, tempC: -11 })).toEqual({
      ok: true,
      output: { fogRisk: true, spreadCelsius: 1.5 },
    });
    expect(runDewpointSpreadFogRisk({ dewpointC: -15, tempC: -2 })).toEqual({
      ok: true,
      output: { fogRisk: false, spreadCelsius: 13 },
    });
  });

  it("flags fog risk when air matches the dew point", () => {
    expect(runDewpointSpreadFogRisk({ dewpointC: 14, tempC: 14 })).toEqual({
      ok: true,
      output: { fogRisk: true, spreadCelsius: 0 },
    });
  });

  it("accepts any finite temperatures in either order", () => {
    const result = runDewpointSpreadFogRisk({ dewpointC: 30, tempC: 20 });
    expect(result).toEqual({
      ok: true,
      output: { fogRisk: true, spreadCelsius: -10 },
    });
  });

  it("rejects non-finite inputs", () => {
    expect(
      runDewpointSpreadFogRisk({ dewpointC: Number.NaN, tempC: 12 }).ok,
    ).toBe(false);
    expect(
      runDewpointSpreadFogRisk({
        dewpointC: 10,
        tempC: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runDewpointSpreadFogRisk({
        dewpointC: 10.5,
        humidity: 95,
        tempC: 12,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "humidity" }] },
      ok: false,
    });
    expect(runDewpointSpreadFogRisk(null).ok).toBe(false);
  });
});
