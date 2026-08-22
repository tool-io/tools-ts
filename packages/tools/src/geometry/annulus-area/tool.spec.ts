import { describe, expect, it } from "vitest";
import { runAnnulusArea } from "./tool.js";

describe("Annulus Area Calculator", () => {
  it("calculates a valid result", () => {
    expect(runAnnulusArea({ innerRadius: 3, outerRadius: 5 })).toEqual({
      ok: true,
      output: { area: expect.closeTo(50.26548245743669, 12) },
    });
  });

  it("rejects an inverted ring through execution", () => {
    expect(runAnnulusArea({ innerRadius: 5, outerRadius: 3 })).toMatchObject({
      error: { issues: [{ code: "invalid_radii" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runAnnulusArea(null).ok).toBe(false));
});
