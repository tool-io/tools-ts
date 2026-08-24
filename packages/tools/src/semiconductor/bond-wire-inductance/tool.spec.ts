import { describe, expect, it } from "vitest";
import {
  bondWireInductanceExample,
  calculateBondWireInductance,
  runBondWireInductance,
} from "./tool.js";

describe("Bond Wire Inductance Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runBondWireInductance(bondWireInductanceExample.input)).toEqual({
      ok: true,
      output: bondWireInductanceExample.output,
    }));

  it("lands near 0.866 nH for a 1 mm 25 µm wire", () => {
    const result = runBondWireInductance(bondWireInductanceExample.input);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.inductanceNh).toBeCloseTo(0.866, 2);
  });

  it("doubles when length and diameter scale together", () =>
    expect(
      runBondWireInductance({ lengthMm: 2, wireDiameterMm: 0.05 }),
    ).toEqual({ ok: true, output: { inductanceNh: 1.7300695260935308 } }));

  it("grows with wire length at fixed diameter", () => {
    const short = runBondWireInductance({
      lengthMm: 1,
      wireDiameterMm: 0.025,
    });
    const long = runBondWireInductance({ lengthMm: 3, wireDiameterMm: 0.025 });
    if (!short.ok || !long.ok) throw new Error("expected success");
    expect(long.output.inductanceNh as number).toBeGreaterThan(
      short.output.inductanceNh as number,
    );
    expect(long.output.inductanceNh as number).toBeLessThan(
      4 * (short.output.inductanceNh as number),
    );
  });

  it("falls as the wire gets thicker", () => {
    const thin = runBondWireInductance({ lengthMm: 2, wireDiameterMm: 0.02 });
    const thick = runBondWireInductance({ lengthMm: 2, wireDiameterMm: 0.05 });
    if (!thin.ok || !thick.ok) throw new Error("expected success");
    expect(thick.output.inductanceNh as number).toBeLessThan(
      thin.output.inductanceNh as number,
    );
  });

  it("rejects zero length via schema", () =>
    expect(
      runBondWireInductance({
        ...bondWireInductanceExample.input,
        lengthMm: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthMm" }] },
      ok: false,
    }));

  it("rejects negative diameter via schema", () =>
    expect(
      runBondWireInductance({
        ...bondWireInductanceExample.input,
        wireDiameterMm: -0.025,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "wireDiameterMm" }],
      },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runBondWireInductance({
        ...bondWireInductanceExample.input,
        lengthMm: Number.NaN,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthMm" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runBondWireInductance({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthMm" }] },
      ok: false,
    }));

  it("direct rejects non-positive length/diameter with stable codes", () => {
    let e: unknown = null;
    try {
      calculateBondWireInductance({ lengthMm: 0, wireDiameterMm: 0.025 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_length");
    e = null;
    try {
      calculateBondWireInductance({ lengthMm: 1, wireDiameterMm: -0.025 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_diameter");
  });

  it("rejects unknown input fields", () =>
    expect(
      runBondWireInductance({
        ...bondWireInductanceExample.input,
        extra: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
