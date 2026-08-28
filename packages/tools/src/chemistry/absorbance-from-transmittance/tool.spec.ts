import { describe, expect, it } from "vitest";
import {
  runAbsorbanceFromTransmittance,
  absorbanceFromTransmittanceExample,
} from "./tool.js";
describe("Absorbance From Transmittance", () => {
  it("publishes an executable example", () =>
    expect(
      runAbsorbanceFromTransmittance(absorbanceFromTransmittanceExample.input),
    ).toEqual({
      ok: true,
      output: absorbanceFromTransmittanceExample.output,
    }));
  it("maps fifty percent transmittance to about zero point three zero one", () => {
    const result = runAbsorbanceFromTransmittance({ transmittancePercent: 50 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.absorbance).toBeCloseTo(0.3010299956639812, 12);
  });
  it("maps one percent transmittance to an absorbance of two", () =>
    expect(runAbsorbanceFromTransmittance({ transmittancePercent: 1 })).toEqual(
      {
        ok: true,
        output: { absorbance: 2 },
      },
    ));
  it("maps a tenth of a percent transmittance to an absorbance of three", () =>
    expect(
      runAbsorbanceFromTransmittance({ transmittancePercent: 0.1 }),
    ).toEqual({
      ok: true,
      output: { absorbance: 3 },
    }));
  it("rejects zero percent transmittance", () =>
    expect(runAbsorbanceFromTransmittance({ transmittancePercent: 0 }).ok).toBe(
      false,
    ));
  it("rejects one hundred percent transmittance", () =>
    expect(
      runAbsorbanceFromTransmittance({ transmittancePercent: 100 }).ok,
    ).toBe(false));
  it("rejects transmittance above the range", () =>
    expect(
      runAbsorbanceFromTransmittance({ transmittancePercent: 150 }).ok,
    ).toBe(false));
  it("rejects negative transmittance", () =>
    expect(
      runAbsorbanceFromTransmittance({ transmittancePercent: -5 }).ok,
    ).toBe(false));
});
