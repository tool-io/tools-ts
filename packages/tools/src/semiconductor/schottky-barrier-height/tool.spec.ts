import { describe, expect, it } from "vitest";
import {
  calculateSchottkyBarrierHeight,
  runSchottkyBarrierHeight,
  schottkyBarrierHeightExample,
} from "./tool.js";

describe("schottky barrier height calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSchottkyBarrierHeight(schottkyBarrierHeightExample.input),
    ).toEqual({ ok: true, output: schottkyBarrierHeightExample.output });
  });

  it("maps 5.65 eV minus 4.07 eV to exactly 1.58 eV", () => {
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: 5.65,
        semiconductorElectronAffinityEv: 4.07,
      }),
    ).toEqual({ ok: true, output: { barrierHeightEv: 1.58 } });
  });

  it("maps integer inputs to an exact unit barrier", () => {
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: 5,
        semiconductorElectronAffinityEv: 4,
      }),
    ).toEqual({ ok: true, output: { barrierHeightEv: 1 } });
  });

  it("allows a signed negative barrier for ohmic-like contacts", () => {
    const result = runSchottkyBarrierHeight({
      metalWorkFunctionEv: 3.9,
      semiconductorElectronAffinityEv: 4.05,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.barrierHeightEv).toBe(-0.1499999999999999);
    expect(result.output.barrierHeightEv).toBeCloseTo(-0.15, 12);
  });

  it("returns exactly zero for equal work function and affinity", () => {
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: 4.61,
        semiconductorElectronAffinityEv: 4.61,
      }),
    ).toEqual({ ok: true, output: { barrierHeightEv: 0 } });
  });

  it("is antisymmetric when the two inputs are swapped", () => {
    const forward = calculateSchottkyBarrierHeight({
      metalWorkFunctionEv: 4.75,
      semiconductorElectronAffinityEv: 4.05,
    }).barrierHeightEv;
    const backward = calculateSchottkyBarrierHeight({
      metalWorkFunctionEv: 4.05,
      semiconductorElectronAffinityEv: 4.75,
    }).barrierHeightEv;
    expect(forward).toBeCloseTo(0.7000000000000002, 15);
    expect(forward).toBeCloseTo(-backward, 12);
  });

  it("allows negative electron affinity but rejects negative work function", () => {
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: 0.5,
        semiconductorElectronAffinityEv: -2,
      }),
    ).toEqual({ ok: true, output: { barrierHeightEv: 2.5 } });
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: -0.5,
        semiconductorElectronAffinityEv: 4,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "metalWorkFunctionEv" }],
      },
      ok: false,
    });
  });

  it("rejects missing and non-numeric inputs", () => {
    const missing = runSchottkyBarrierHeight({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.code).toBe("invalid_input");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: "gold",
        semiconductorElectronAffinityEv: 4.05,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: Number.NaN,
        semiconductorElectronAffinityEv: 4.05,
      }).ok,
    ).toBe(false);
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: 5.1,
        semiconductorElectronAffinityEv: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
    expect(
      runSchottkyBarrierHeight({
        metalWorkFunctionEv: Number.NEGATIVE_INFINITY,
        semiconductorElectronAffinityEv: 4.05,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runSchottkyBarrierHeight({
      metalWorkFunctionEv: 5.1,
      semiconductorElectronAffinityEv: 4.05,
      temperatureK: 300,
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    expect(runSchottkyBarrierHeight(undefined).ok).toBe(false);
    const nonObject = runSchottkyBarrierHeight(1.58);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });
});
