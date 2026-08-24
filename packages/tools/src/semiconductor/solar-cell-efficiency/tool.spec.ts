import { describe, expect, it } from "vitest";
import { runSolarCellEfficiency, solarCellEfficiencyExample } from "./tool.js";

describe("solar cell efficiency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSolarCellEfficiency(solarCellEfficiencyExample.input)).toEqual({
      ok: true,
      output: solarCellEfficiencyExample.output,
    });
  });

  it("matches the product of current density, voltage, and fill factor", () => {
    const result = runSolarCellEfficiency({
      fillFactor: 0.85,
      jscMAPerCm2: 40,
      openCircuitVoltageVolts: 0.72,
    });
    expect(result).toEqual({
      ok: true,
      output: { efficiencyPercent: 24.479999999999997 },
    });
  });

  it("scales linearly with current density", () => {
    const one = runSolarCellEfficiency({
      fillFactor: 0.8,
      jscMAPerCm2: 10,
      openCircuitVoltageVolts: 0.6,
    });
    const two = runSolarCellEfficiency({
      fillFactor: 0.8,
      jscMAPerCm2: 20,
      openCircuitVoltageVolts: 0.6,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(two.output.efficiencyPercent as number).toBe(
      2 * (one.output.efficiencyPercent as number),
    );
  });

  it("yields zero efficiency at zero fill factor", () => {
    const result = runSolarCellEfficiency({
      fillFactor: 0,
      jscMAPerCm2: 25,
      openCircuitVoltageVolts: 0.6,
    });
    expect(result).toEqual({ ok: true, output: { efficiencyPercent: 0 } });
  });

  it("uses unity fill factor as an upper bound", () => {
    const result = runSolarCellEfficiency({
      fillFactor: 1,
      jscMAPerCm2: 25,
      openCircuitVoltageVolts: 0.6,
    });
    expect(result).toEqual({ ok: true, output: { efficiencyPercent: 15 } });
  });

  it("uses the supplied incident power density", () => {
    expect(
      runSolarCellEfficiency({
        fillFactor: 0.8,
        incidentPowerDensityMwPerCm2: 50,
        jscMAPerCm2: 25,
        openCircuitVoltageVolts: 0.6,
      }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 24 } });
  });

  it("rejects inconsistent inputs that imply efficiency above 100 percent", () => {
    expect(
      runSolarCellEfficiency({
        fillFactor: 1,
        incidentPowerDensityMwPerCm2: 1,
        jscMAPerCm2: 100,
        openCircuitVoltageVolts: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_efficiency" }] },
      ok: false,
    });
  });

  it("rejects non-positive current density", () => {
    for (const jsc of [0, -5])
      expect(
        runSolarCellEfficiency({
          fillFactor: 0.8,
          jscMAPerCm2: jsc,
          openCircuitVoltageVolts: 0.6,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_jsc" }] },
        ok: false,
      });
  });

  it("rejects non-positive voltage", () => {
    for (const voc of [0, -1])
      expect(
        runSolarCellEfficiency({
          fillFactor: 0.8,
          jscMAPerCm2: 25,
          openCircuitVoltageVolts: voc,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_voc" }] },
        ok: false,
      });
  });

  it("rejects fill factors outside the inclusive unit range", () => {
    for (const ff of [-0.1, 1.1])
      expect(
        runSolarCellEfficiency({
          fillFactor: ff,
          jscMAPerCm2: 25,
          openCircuitVoltageVolts: 0.6,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects missing and non-finite inputs", () => {
    expect(
      runSolarCellEfficiency({
        fillFactor: 0.8,
        openCircuitVoltageVolts: 0.6,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runSolarCellEfficiency({
        fillFactor: Number.NaN,
        jscMAPerCm2: 25,
        openCircuitVoltageVolts: 0.6,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });
});
