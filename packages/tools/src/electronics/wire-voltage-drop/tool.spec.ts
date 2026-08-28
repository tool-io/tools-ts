import { describe, expect, it } from "vitest";
import { runWireVoltageDrop, wireVoltageDropExample } from "./tool.js";

describe("Wire Voltage Drop", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runWireVoltageDrop(wireVoltageDropExample.input)).toEqual({
      ok: true,
      output: wireVoltageDropExample.output,
    }));

  it("doubles the drop when the current doubles", () =>
    expect(
      runWireVoltageDrop({
        crossSectionMm2: 1.5,
        currentAmps: 10,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 20,
      }),
    ).toEqual({ ok: true, output: { voltageDropV: 4.666666666666667 } }));

  it("doubles the drop when the run length doubles", () => {
    const short = runWireVoltageDrop({
      crossSectionMm2: 1.5,
      currentAmps: 5,
      resistivityOhmMm2PerM: 0.0175,
      wireLengthMeters: 20,
    });
    const long = runWireVoltageDrop({
      crossSectionMm2: 1.5,
      currentAmps: 5,
      resistivityOhmMm2PerM: 0.0175,
      wireLengthMeters: 40,
    });
    expect(short.ok).toBe(true);
    expect(long.ok).toBe(true);
    if (!short.ok || !long.ok) return;
    expect(Number(long.output.voltageDropV)).toEqual(
      Number(short.output.voltageDropV) * 2,
    );
  });

  it("shrinks the drop with a thicker conductor", () => {
    const thin = runWireVoltageDrop({
      crossSectionMm2: 1.5,
      currentAmps: 5,
      resistivityOhmMm2PerM: 0.0175,
      wireLengthMeters: 20,
    });
    const thick = runWireVoltageDrop({
      crossSectionMm2: 3,
      currentAmps: 5,
      resistivityOhmMm2PerM: 0.0175,
      wireLengthMeters: 20,
    });
    expect(thin.ok).toBe(true);
    expect(thick.ok).toBe(true);
    if (!thin.ok || !thick.ok) return;
    expect(Number(thick.output.voltageDropV)).toBeLessThan(
      Number(thin.output.voltageDropV),
    );
  });

  it("rejects zero current", () =>
    expect(
      runWireVoltageDrop({
        crossSectionMm2: 1.5,
        currentAmps: 0,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 20,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "currentAmps" }] },
      ok: false,
    }));

  it("rejects zero wire length", () =>
    expect(
      runWireVoltageDrop({
        crossSectionMm2: 1.5,
        currentAmps: 5,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "wireLengthMeters" }],
      },
      ok: false,
    }));

  it("rejects negative resistivity", () =>
    expect(
      runWireVoltageDrop({
        crossSectionMm2: 1.5,
        currentAmps: 5,
        resistivityOhmMm2PerM: -0.0175,
        wireLengthMeters: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resistivityOhmMm2PerM" }],
      },
      ok: false,
    }));

  it("rejects zero cross-section", () =>
    expect(
      runWireVoltageDrop({
        crossSectionMm2: 0,
        currentAmps: 5,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "crossSectionMm2" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runWireVoltageDrop({
        crossSectionMm2: 1.5,
        currentAmps: 5,
        extra: "x",
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 20,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
