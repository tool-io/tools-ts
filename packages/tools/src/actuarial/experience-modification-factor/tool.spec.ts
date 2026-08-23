import { describe, expect, it } from "vitest";
import {
  calculateExperienceModificationFactor,
  experienceModificationFactorExample,
  runExperienceModificationFactor,
} from "./tool.js";

describe("experience modification factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runExperienceModificationFactor(
        experienceModificationFactorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: experienceModificationFactorExample.output,
    });
  });

  it("credits better-than-expected experience below one", () => {
    expect(
      calculateExperienceModificationFactor({
        actualExcessLosses: 50000,
        actualPrimaryLosses: 10000,
        ballast: 400000,
        excessWeight: 0.2,
        expectedExcessLosses: 75000,
        expectedPrimaryLosses: 25000,
      }),
    ).toEqual({ modificationFactor: 0.96 });
  });

  it("returns exactly one when actual losses equal expected losses", () => {
    expect(
      calculateExperienceModificationFactor({
        actualExcessLosses: 75000,
        actualPrimaryLosses: 25000,
        ballast: 400000,
        excessWeight: 0.2,
        expectedExcessLosses: 75000,
        expectedPrimaryLosses: 25000,
      }),
    ).toEqual({ modificationFactor: 1 });
  });

  it("rejects malformed input with field-specific issues", () => {
    expect(runExperienceModificationFactor(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      runExperienceModificationFactor({
        ...experienceModificationFactorExample.input,
        unexpectedField: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpectedField" }] },
      ok: false,
    });
  });

  it("rejects non-positive expected losses with a stable code", () => {
    expect(
      runExperienceModificationFactor({
        actualExcessLosses: 100,
        actualPrimaryLosses: 100,
        ballast: 100,
        excessWeight: 0.2,
        expectedExcessLosses: 0,
        expectedPrimaryLosses: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_total_expected_losses_required",
            field: "expectedPrimaryLosses",
          },
        ],
      },
      ok: false,
    });
  });
});
