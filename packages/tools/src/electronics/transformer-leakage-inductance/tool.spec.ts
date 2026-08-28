import { describe, expect, it } from "vitest";
import {
  calculateTransformerLeakageInductance,
  runTransformerLeakageInductance,
  transformerLeakageInductanceExample,
} from "./tool.js";

describe("Leakage Inductance Estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTransformerLeakageInductance(
        transformerLeakageInductanceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: transformerLeakageInductanceExample.output,
    });
  });

  it("uses a default coupling coefficient of 0.99", () => {
    expect(
      calculateTransformerLeakageInductance({ magnetizingUh: 250000 })
        .leakageInductanceUh,
    ).toBe(4975.000000000007);
  });

  it("shrinks leakage as coupling tightens", () => {
    const loose = calculateTransformerLeakageInductance({
      couplingCoefficientK: 0.9,
      magnetizingUh: 250000,
    }).leakageInductanceUh;
    const tight = calculateTransformerLeakageInductance({
      couplingCoefficientK: 0.999,
      magnetizingUh: 250000,
    }).leakageInductanceUh;
    expect(loose).toBe(47499.999999999985);
    expect(tight).toBeLessThan(loose);
  });

  it("reports half the magnetizing inductance at k = sqrt(0.5)", () => {
    const k = Math.sqrt(0.5);
    const leakage = calculateTransformerLeakageInductance({
      couplingCoefficientK: k,
      magnetizingUh: 200000,
    }).leakageInductanceUh;
    expect(leakage / 200000).toBeCloseTo(0.5, 12);
  });

  it("rejects a coupling coefficient of one via invalid_coupling", () => {
    expect(
      runTransformerLeakageInductance({
        couplingCoefficientK: 1,
        magnetizingUh: 1000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_coupling", field: "couplingCoefficientK" }],
      },
      ok: false,
    });
  });

  it("rejects zero coupling via invalid_coupling", () => {
    expect(
      runTransformerLeakageInductance({
        couplingCoefficientK: 0,
        magnetizingUh: 1000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_coupling", field: "couplingCoefficientK" }],
      },
      ok: false,
    });
  });

  it("rejects non-positive magnetizing inductance via invalid_inductance", () => {
    expect(runTransformerLeakageInductance({ magnetizingUh: 0 })).toMatchObject(
      {
        error: {
          issues: [{ code: "invalid_inductance", field: "magnetizingUh" }],
        },
        ok: false,
      },
    );
  });

  it("rejects missing required inputs", () => {
    expect(runTransformerLeakageInductance({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "magnetizingUh" }],
      },
      ok: false,
    });
  });
});
