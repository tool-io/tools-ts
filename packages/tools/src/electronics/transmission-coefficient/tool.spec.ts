import { describe, expect, it } from "vitest";
import {
  runTransmissionCoefficient,
  transmissionCoefficientExample,
} from "./tool.js";

describe("Transmission Coefficient", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runTransmissionCoefficient(transmissionCoefficientExample.input),
    ).toEqual({ ok: true, output: transmissionCoefficientExample.output }));

  it("returns full transmission for a matched load", () =>
    expect(
      runTransmissionCoefficient({ reflectionCoefficientMagnitude: 0 }),
    ).toEqual({
      ok: true,
      output: { transmissionCoefficientTau: 1 },
    }));

  it("maps a quarter gamma to 0.9375 transmission", () =>
    expect(
      runTransmissionCoefficient({ reflectionCoefficientMagnitude: 0.25 }),
    ).toEqual({
      ok: true,
      output: { transmissionCoefficientTau: 0.9375 },
    }));

  it("keeps tau between zero and one for valid magnitudes", () => {
    const result = runTransmissionCoefficient({
      reflectionCoefficientMagnitude: 0.9,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.transmissionCoefficientTau).toBeGreaterThan(0);
    expect(result.output.transmissionCoefficientTau).toBeLessThan(1);
  });

  it("returns zero transmission for a total reflection magnitude of one", () =>
    expect(
      runTransmissionCoefficient({ reflectionCoefficientMagnitude: 1 }),
    ).toEqual({
      ok: true,
      output: { transmissionCoefficientTau: 0 },
    }));

  it("rejects gamma magnitudes above one", () =>
    expect(
      runTransmissionCoefficient({ reflectionCoefficientMagnitude: 1.5 }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_reflection",
            field: "reflectionCoefficientMagnitude",
          },
        ],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runTransmissionCoefficient(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
