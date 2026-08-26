import { describe, expect, it } from "vitest";
import { nailWithdrawalExample, runNailWithdrawal } from "./tool.js";

describe("Nail Withdrawal Estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNailWithdrawal(nailWithdrawalExample.input)).toEqual({
      ok: true,
      output: nailWithdrawalExample.output,
    });
  });

  it("applies the hardwood factor of one point four", () => {
    expect(
      runNailWithdrawal({
        penetrationDepthMm: 40,
        shankDiameterMm: 3,
        woodGroup: "hardwood",
      }),
    ).toEqual({
      ok: true,
      output: { withdrawalKg: 168 },
    });
  });

  it("keeps the plain product for softwood", () => {
    expect(
      runNailWithdrawal({
        penetrationDepthMm: 35,
        shankDiameterMm: 2.8,
        woodGroup: "softwood",
      }),
    ).toEqual({
      ok: true,
      output: { withdrawalKg: 98 },
    });
  });

  it("scales with diameter and depth in hardwood", () => {
    expect(
      runNailWithdrawal({
        penetrationDepthMm: 25,
        shankDiameterMm: 4,
        woodGroup: "hardwood",
      }),
    ).toEqual({
      ok: true,
      output: { withdrawalKg: 140 },
    });
  });

  it("covers both documented wood groups", () => {
    for (const woodGroup of ["softwood", "hardwood"] as const) {
      const result = runNailWithdrawal({
        penetrationDepthMm: 10,
        shankDiameterMm: 2,
        woodGroup,
      });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects a zero shank diameter", () => {
    const result = runNailWithdrawal({
      penetrationDepthMm: 40,
      shankDiameterMm: 0,
      woodGroup: "softwood",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_diameter");
  });

  it("rejects a zero penetration depth", () => {
    const result = runNailWithdrawal({
      penetrationDepthMm: 0,
      shankDiameterMm: 3,
      woodGroup: "softwood",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_depth");
  });

  it("rejects unknown wood groups", () => {
    const result = runNailWithdrawal({
      penetrationDepthMm: 40,
      shankDiameterMm: 3,
      woodGroup: "plywood" as never,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires every input", () => {
    expect(runNailWithdrawal({}).ok).toBe(false);
    expect(
      runNailWithdrawal({
        penetrationDepthMm: 40,
        shankDiameterMm: 3,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runNailWithdrawal(null).ok).toBe(false);
  });
});
