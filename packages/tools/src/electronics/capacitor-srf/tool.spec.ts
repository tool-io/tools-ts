import { describe, expect, it } from "vitest";
import {
  calculateCapacitorSrf,
  capacitorSrfExample,
  runCapacitorSrf,
} from "./tool.js";

describe("Capacitor SRF", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCapacitorSrf(capacitorSrfExample.input)).toEqual({
      ok: true,
      output: capacitorSrfExample.output,
    });
  });

  it("matches the 159.155 shortcut for nH and nF inputs", () => {
    expect(
      calculateCapacitorSrf({ capacitanceNf: 100, lEquivalentNh: 100 })
        .selfResonantFreqMhz,
    ).toBeCloseTo(1000 / (2 * Math.PI) / Math.sqrt(100 * 100), 12);
  });

  it("drops as the square root of the product of L and C", () => {
    const base = calculateCapacitorSrf({
      capacitanceNf: 10,
      lEquivalentNh: 10,
    }).selfResonantFreqMhz;
    const quadrupled = calculateCapacitorSrf({
      capacitanceNf: 40,
      lEquivalentNh: 40,
    }).selfResonantFreqMhz;
    expect(quadrupled).toBeCloseTo(base / 4, 12);
  });

  it("keeps the SI conversion consistent between nH and nF", () => {
    const a = calculateCapacitorSrf({
      capacitanceNf: 47,
      lEquivalentNh: 22,
    }).selfResonantFreqMhz;
    expect(a).toBeGreaterThan(0);
    expect(
      calculateCapacitorSrf({ capacitanceNf: 22, lEquivalentNh: 47 })
        .selfResonantFreqMhz,
    ).toBe(a);
  });

  it("rejects zero inductance with a stable code", () => {
    expect(
      runCapacitorSrf({ capacitanceNf: 100, lEquivalentNh: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "lEquivalentNh" }] },
      ok: false,
    });
  });

  it("rejects negative capacitance with a stable code", () => {
    expect(
      runCapacitorSrf({ capacitanceNf: -1, lEquivalentNh: 100 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "capacitanceNf" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runCapacitorSrf({
        ...capacitorSrfExample.input,
        extraFarads: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extraFarads" }] },
      ok: false,
    });
  });
});
