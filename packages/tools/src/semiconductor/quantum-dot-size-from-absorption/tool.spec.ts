import { describe, expect, it } from "vitest";
import {
  quantumDotSizeFromAbsorptionExample,
  runQuantumDotSizeFromAbsorption,
} from "./tool.js";

describe("CdSe Quantum Dot Diameter from Absorption Peak", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runQuantumDotSizeFromAbsorption(
        quantumDotSizeFromAbsorptionExample.input,
      ),
    ).toEqual({ ok: true, output: { diameterNm: 2.3449999999999207 } }));

  it("gives roughly 2.3 nm at a 500 nm first absorption peak", () => {
    const result = runQuantumDotSizeFromAbsorption(
      quantumDotSizeFromAbsorptionExample.input,
    );
    if (!result.ok) throw new Error("expected success");
    expect(result.output.diameterNm).toBeCloseTo(2.345, 9);
  });

  it("accepts the lower schema boundary of 400 nm", () =>
    expect(
      runQuantumDotSizeFromAbsorption({ firstExcitonAbsorptionPeakNm: 400 }),
    ).toEqual({ ok: true, output: { diameterNm: 1.5543199999999686 } }));

  it("accepts the upper schema boundary of 650 nm", () =>
    expect(
      runQuantumDotSizeFromAbsorption({ firstExcitonAbsorptionPeakNm: 650 }),
    ).toEqual({ ok: true, output: { diameterNm: 7.761338749999943 } }));

  it("grows monotonically toward redder emission", () => {
    const green = runQuantumDotSizeFromAbsorption({
      firstExcitonAbsorptionPeakNm: 550,
    });
    const red = runQuantumDotSizeFromAbsorption({
      firstExcitonAbsorptionPeakNm: 600,
    });
    if (!green.ok || !red.ok) throw new Error("expected success");
    expect(red.output.diameterNm as number).toBeGreaterThan(
      green.output.diameterNm as number,
    );
  });

  it("rejects wavelengths below the fitted range", () =>
    expect(
      runQuantumDotSizeFromAbsorption({ firstExcitonAbsorptionPeakNm: 399 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "firstExcitonAbsorptionPeakNm" },
        ],
      },
      ok: false,
    }));

  it("rejects wavelengths above the fitted range", () =>
    expect(
      runQuantumDotSizeFromAbsorption({ firstExcitonAbsorptionPeakNm: 651 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "firstExcitonAbsorptionPeakNm" },
        ],
      },
      ok: false,
    }));

  it("rejects non-numeric wavelengths", () =>
    expect(
      runQuantumDotSizeFromAbsorption({
        firstExcitonAbsorptionPeakNm: "500",
      }).ok,
    ).toBe(false));

  it("rejects missing required inputs", () =>
    expect(runQuantumDotSizeFromAbsorption({})).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "firstExcitonAbsorptionPeakNm" },
        ],
      },
      ok: false,
    }));
});
