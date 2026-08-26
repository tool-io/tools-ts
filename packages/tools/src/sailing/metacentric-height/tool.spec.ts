import { describe, expect, it } from "vitest";
import { metacentricHeightExample, runMetacentricHeight } from "./tool.js";

describe("metacentric height calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMetacentricHeight(metacentricHeightExample.input)).toEqual({
      ok: true,
      output: metacentricHeightExample.output,
    });
  });

  it("adds KB and BM then subtracts KG", () => {
    const result = runMetacentricHeight({
      buoyancyToMetacenterFeet: 5.5,
      keelToCenterBuoyancyFeet: 2.25,
      keelToCenterGravityFeet: 6.1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.metacentricHeightFeet).toBeCloseTo(1.65, 12);
  });

  it("allows a negative GM for an unstable arrangement", () => {
    const result = runMetacentricHeight({
      buoyancyToMetacenterFeet: 1,
      keelToCenterBuoyancyFeet: 1,
      keelToCenterGravityFeet: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.metacentricHeightFeet).toBe(-3);
  });

  it("raises GM one-for-one with BM", () => {
    const base = runMetacentricHeight({
      buoyancyToMetacenterFeet: 2,
      keelToCenterBuoyancyFeet: 3,
      keelToCenterGravityFeet: 4,
    });
    const raised = runMetacentricHeight({
      buoyancyToMetacenterFeet: 3,
      keelToCenterBuoyancyFeet: 3,
      keelToCenterGravityFeet: 4,
    });
    if (!base.ok || !raised.ok) throw new Error("expected success");
    expect(raised.output.metacentricHeightFeet).toBe(
      (base.output.metacentricHeightFeet as number) + 1,
    );
  });

  it("rejects zero and negative KB with a stable code", () => {
    for (const keelToCenterBuoyancyFeet of [0, -2])
      expect(
        runMetacentricHeight({
          buoyancyToMetacenterFeet: 2,
          keelToCenterBuoyancyFeet,
          keelToCenterGravityFeet: 4,
        }),
      ).toMatchObject({
        error: {
          issues: [
            { code: "invalid_input", field: "keelToCenterBuoyancyFeet" },
          ],
        },
        ok: false,
      });
  });

  it("rejects zero and negative KG with a stable code", () => {
    for (const keelToCenterGravityFeet of [0, -1])
      expect(
        runMetacentricHeight({
          buoyancyToMetacenterFeet: 2,
          keelToCenterBuoyancyFeet: 3,
          keelToCenterGravityFeet,
        }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_input", field: "keelToCenterGravityFeet" }],
        },
        ok: false,
      });
  });

  it("rejects zero and negative BM with a stable code", () => {
    for (const buoyancyToMetacenterFeet of [0, -0.5])
      expect(
        runMetacentricHeight({
          buoyancyToMetacenterFeet,
          keelToCenterBuoyancyFeet: 3,
          keelToCenterGravityFeet: 4,
        }),
      ).toMatchObject({
        error: {
          issues: [
            { code: "invalid_input", field: "buoyancyToMetacenterFeet" },
          ],
        },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(
      runMetacentricHeight({
        buoyancyToMetacenterFeet: 2,
        keelToCenterBuoyancyFeet: 3,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "keelToCenterGravityFeet" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      {
        buoyancyToMetacenterFeet: Number.NaN,
        keelToCenterBuoyancyFeet: 3,
        keelToCenterGravityFeet: 4,
      },
      {
        buoyancyToMetacenterFeet: 2,
        keelToCenterBuoyancyFeet: Number.POSITIVE_INFINITY,
        keelToCenterGravityFeet: 4,
      },
    ])
      expect(runMetacentricHeight(bad).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runMetacentricHeight({
        beamFeet: 10,
        buoyancyToMetacenterFeet: 2,
        keelToCenterBuoyancyFeet: 3,
        keelToCenterGravityFeet: 4,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beamFeet" }] },
      ok: false,
    });
  });
});
