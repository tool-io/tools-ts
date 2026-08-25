import { describe, expect, it } from "vitest";
import { runDiversityShannonWiener } from "./tool.js";

describe("Shannon Wiener H", () => {
  it("calculates a valid result", () =>
    expect(
      runDiversityShannonWiener({ proportion1: 0.5, proportion2: 0.5 }),
    ).toEqual({
      ok: true,
      output: { shannonWienerIndex: 0.6931471805599453 },
    }));
  it("is zero for a single dominant species", () =>
    expect(runDiversityShannonWiener({ proportion1: 1 })).toEqual({
      ok: true,
      output: { shannonWienerIndex: 0 },
    }));
  it("ignores absent species entries", () =>
    expect(
      runDiversityShannonWiener({ proportion1: 1, proportion2: 0 }),
    ).toEqual({ ok: true, output: { shannonWienerIndex: 0 } }));
  it("sums three species contributions", () =>
    expect(
      runDiversityShannonWiener({
        proportion1: 0.25,
        proportion2: 0.25,
        proportion3: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { shannonWienerIndex: 1.0397207708399179 },
    }));
  it("peaks for five uniform species", () =>
    expect(
      runDiversityShannonWiener({
        proportion1: 0.2,
        proportion2: 0.2,
        proportion3: 0.2,
        proportion4: 0.2,
        proportion5: 0.2,
      }),
    ).toEqual({
      ok: true,
      output: { shannonWienerIndex: 1.6094379124341005 },
    }));
  it("accepts sums within floating-point tolerance of one", () =>
    expect(
      runDiversityShannonWiener({
        proportion1: 0.9,
        proportion2: 0.0999999995,
      }),
    ).toEqual({
      ok: true,
      output: { shannonWienerIndex: 0.3250829727401557 },
    }));
  it("rejects proportions exceeding one", () => {
    const result = runDiversityShannonWiener({
      proportion1: 0.6,
      proportion2: 0.6,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_proportions");
  });
  it("rejects proportions above one per entry", () =>
    expect(runDiversityShannonWiener({ proportion1: 1.5 }).ok).toBe(false));
  it("rejects incomplete proportions", () =>
    expect(
      runDiversityShannonWiener({ proportion1: 0.4, proportion2: 0.4 }).ok,
    ).toBe(false));
});
