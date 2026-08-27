import { describe, expect, it } from "vitest";
import { runStrokeWork, strokeWorkExample } from "./tool.js";

describe("Stroke Work Calculator", () => {
  it("publishes an executable example", () =>
    expect(runStrokeWork(strokeWorkExample.input)).toEqual({
      ok: true,
      output: strokeWorkExample.output,
    }));
  it("allows equal pressures yielding zero", () =>
    expect(
      runStrokeWork({
        strokeVolumeMl: 60,
        meanArterialMmhg: 88,
        meanAtrialMmhg: 88,
      }),
    ).toEqual({ ok: true, output: { strokeWorkGramMeters: 0 } }));
  it("computes another valid result", () =>
    expect(
      runStrokeWork({
        strokeVolumeMl: 80,
        meanArterialMmhg: 100,
        meanAtrialMmhg: 10,
      }),
    ).toEqual({
      ok: true,
      output: { strokeWorkGramMeters: 103.67999999999999 },
    }));
  it("allows a negative gradient producing negative work", () =>
    expect(
      runStrokeWork({
        strokeVolumeMl: 70,
        meanArterialMmhg: 5,
        meanAtrialMmhg: 90,
      }),
    ).toEqual({
      ok: true,
      output: { strokeWorkGramMeters: -85.67999999999999 },
    }));
  it("rejects zero stroke volume", () => {
    const result = runStrokeWork({
      strokeVolumeMl: 0,
      meanArterialMmhg: 90,
      meanAtrialMmhg: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative stroke volume", () => {
    const result = runStrokeWork({
      strokeVolumeMl: -70,
      meanArterialMmhg: 90,
      meanAtrialMmhg: 5,
    });
    expect(result.ok).toBe(false);
  });
});
