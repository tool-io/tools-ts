import { describe, expect, it } from "vitest";
import { runScrewPullOut, screwPullOutExample } from "./tool.js";

describe("Screw Pull-Out Estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runScrewPullOut(screwPullOutExample.input)).toEqual({
      ok: true,
      output: screwPullOutExample.output,
    });
  });

  it("applies the hardwood factor of one point two", () => {
    expect(
      runScrewPullOut({
        coreDiameterMm: 2.5,
        penetrationDepthMm: 30,
        woodGroup: "hardwood",
      }),
    ).toEqual({
      ok: true,
      output: { pullOutKg: 22.5 },
    });
  });

  it("squares the three millimetre core in softwood", () => {
    expect(
      runScrewPullOut({
        coreDiameterMm: 3,
        penetrationDepthMm: 40,
        woodGroup: "softwood",
      }),
    ).toEqual({
      ok: true,
      output: { pullOutKg: 28.8 },
    });
  });

  it("squares the four millimetre core in softwood", () => {
    expect(
      runScrewPullOut({
        coreDiameterMm: 4,
        penetrationDepthMm: 50,
        woodGroup: "softwood",
      }),
    ).toEqual({
      ok: true,
      output: { pullOutKg: 64 },
    });
  });

  it("covers both documented wood groups", () => {
    for (const woodGroup of ["softwood", "hardwood"] as const) {
      const result = runScrewPullOut({
        coreDiameterMm: 2,
        penetrationDepthMm: 20,
        woodGroup,
      });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects a zero core diameter", () => {
    const result = runScrewPullOut({
      coreDiameterMm: 0,
      penetrationDepthMm: 30,
      woodGroup: "softwood",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_diameter");
  });

  it("rejects a negative penetration depth", () => {
    const result = runScrewPullOut({
      coreDiameterMm: 2.5,
      penetrationDepthMm: -30,
      woodGroup: "softwood",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_depth");
  });

  it("rejects unknown wood groups", () => {
    const result = runScrewPullOut({
      coreDiameterMm: 2.5,
      penetrationDepthMm: 30,
      woodGroup: "osb" as never,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires every input", () => {
    expect(runScrewPullOut({}).ok).toBe(false);
    expect(runScrewPullOut({ coreDiameterMm: 2.5 }).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runScrewPullOut(undefined).ok).toBe(false);
  });
});
