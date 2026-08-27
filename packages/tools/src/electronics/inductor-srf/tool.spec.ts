import { describe, expect, it } from "vitest";
import {
  calculateInductorSrf,
  inductorSrfExample,
  runInductorSrf,
} from "./tool.js";

describe("Inductor SRF", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInductorSrf(inductorSrfExample.input)).toEqual({
      ok: true,
      output: inductorSrfExample.output,
    });
  });

  it("agrees with the closed form 1000 over two pi sqrt LC for uH and pF", () => {
    expect(
      calculateInductorSrf({ inductanceUh: 1, parasiticCapacitancePf: 1 })
        .selfResonantFreqMhz,
    ).toBeCloseTo(1000 / (2 * Math.PI), 6);
  });

  it("divides by root two when parasitic capacitance doubles", () => {
    const base = calculateInductorSrf({
      inductanceUh: 10,
      parasiticCapacitancePf: 2,
    }).selfResonantFreqMhz;
    expect(
      calculateInductorSrf({ inductanceUh: 10, parasiticCapacitancePf: 4 })
        .selfResonantFreqMhz,
    ).toBeCloseTo(base / Math.SQRT2, 9);
  });

  it("scales inversely with the square root of inductance", () => {
    const base = calculateInductorSrf({
      inductanceUh: 1,
      parasiticCapacitancePf: 3,
    }).selfResonantFreqMhz;
    expect(
      calculateInductorSrf({ inductanceUh: 4, parasiticCapacitancePf: 3 })
        .selfResonantFreqMhz,
    ).toBeCloseTo(base / 2, 12);
  });

  it("rejects zero parasitic capacitance with a stable code", () => {
    expect(
      runInductorSrf({ inductanceUh: 1, parasiticCapacitancePf: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "parasiticCapacitancePf" }],
      },
      ok: false,
    });
  });

  it("rejects negative inductance with a stable code", () => {
    expect(
      runInductorSrf({ inductanceUh: -5, parasiticCapacitancePf: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "inductanceUh" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runInductorSrf({ inductanceUh: 1 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "parasiticCapacitancePf" }],
      },
      ok: false,
    });
  });
});
