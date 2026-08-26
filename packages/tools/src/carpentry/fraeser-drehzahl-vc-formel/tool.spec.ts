import { describe, expect, it } from "vitest";
import { routerRpmExample, runRouterRpm } from "./tool.js";

describe("Router RPM VC Formula", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runRouterRpm(routerRpmExample.input)).toEqual({
      ok: true,
      output: routerRpmExample.output,
    }));

  it("doubles the speed when cutting speed doubles", () =>
    expect(runRouterRpm({ cuttingSpeedMPm: 1200, diameterMm: 8 })).toEqual({
      ok: true,
      output: { rpm: 47746.482927568606 },
    }));

  it("halves the speed when the diameter doubles", () =>
    expect(runRouterRpm({ cuttingSpeedMPm: 600, diameterMm: 16 })).toEqual({
      ok: true,
      output: { rpm: 11936.620731892152 },
    }));

  it("calculates a small cutter at moderate speed", () =>
    expect(runRouterRpm({ cuttingSpeedMPm: 300, diameterMm: 10 })).toEqual({
      ok: true,
      output: { rpm: 9549.29658551372 },
    }));

  it("produces higher speeds for smaller diameters", () => {
    const small = runRouterRpm({ cuttingSpeedMPm: 500, diameterMm: 6 });
    const large = runRouterRpm({ cuttingSpeedMPm: 500, diameterMm: 12 });
    if (small.ok && large.ok)
      expect(Number(small.output.rpm)).toBeGreaterThan(
        Number(large.output.rpm),
      );
    else expect.fail("expected successful results");
  });

  it("rejects a zero or negative cutting speed", () => {
    for (const cuttingSpeedMPm of [0, -600]) {
      const result = runRouterRpm({ cuttingSpeedMPm, diameterMm: 8 });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_cutting_speed");
    }
  });

  it("rejects a zero diameter", () => {
    const result = runRouterRpm({ cuttingSpeedMPm: 600, diameterMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_diameter");
  });

  it("rejects a negative diameter", () => {
    const result = runRouterRpm({ cuttingSpeedMPm: 600, diameterMm: -8 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_diameter");
  });

  it("rejects missing inputs", () => {
    for (const input of [{}, { cuttingSpeedMPm: 600 }, { diameterMm: 8 }]) {
      const result = runRouterRpm(input as never);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_input");
    }
  });

  it("rejects non-finite input", () =>
    expect(
      runRouterRpm({ cuttingSpeedMPm: Number.NaN, diameterMm: 8 }).ok,
    ).toBe(false));

  it("rejects unknown input fields", () =>
    expect(
      runRouterRpm({ cuttingSpeedMPm: 600, diameterMm: 8, extra: 1 } as never)
        .ok,
    ).toBe(false));
});
