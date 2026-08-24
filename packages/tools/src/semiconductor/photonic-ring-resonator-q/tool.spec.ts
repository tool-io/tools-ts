import { describe, expect, it } from "vitest";
import { ringResonatorQExample, runRingResonatorQ } from "./tool.js";

describe("Ring Resonator Q Factor Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runRingResonatorQ(ringResonatorQExample.input)).toEqual({
      ok: true,
      output: { qualityFactor: 3100 },
    }));

  it("computes the O-band case", () =>
    expect(
      runRingResonatorQ({ fwhmNm: 1, resonanceWavelengthNm: 1310 }),
    ).toEqual({ ok: true, output: { qualityFactor: 1310 } }));

  it("lowers the Q for a broader linewidth", () =>
    expect(
      runRingResonatorQ({
        ...ringResonatorQExample.input,
        fwhmNm: 5,
      }),
    ).toEqual({ ok: true, output: { qualityFactor: 310 } }));

  it("raises the Q for a narrower linewidth", () => {
    const wide = runRingResonatorQ(ringResonatorQExample.input);
    const narrow = runRingResonatorQ({
      ...ringResonatorQExample.input,
      fwhmNm: 0.1,
    });
    if (!wide.ok || !narrow.ok) throw new Error("expected success");
    expect(narrow.output.qualityFactor as number).toBeGreaterThan(
      wide.output.qualityFactor as number,
    );
  });

  it("rejects zero linewidth with a stable code", () =>
    expect(
      runRingResonatorQ({ ...ringResonatorQExample.input, fwhmNm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "fwhmNm" }] },
      ok: false,
    }));

  it("rejects negative wavelength with a stable code", () =>
    expect(
      runRingResonatorQ({
        ...ringResonatorQExample.input,
        resonanceWavelengthNm: -1550,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "resonanceWavelengthNm" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runRingResonatorQ({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "fwhmNm" }] },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runRingResonatorQ({
        ...ringResonatorQExample.input,
        fwhmNm: Number.NaN,
      }).ok,
    ).toBe(false));
});
