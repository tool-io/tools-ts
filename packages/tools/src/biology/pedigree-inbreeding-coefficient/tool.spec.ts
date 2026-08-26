import { describe, expect, it } from "vitest";
import { runPedigreeInbreedingCoefficient } from "./tool.js";

describe("Pedigree F Accumulated", () => {
  it("accumulates onto an existing base coefficient", () =>
    expect(
      runPedigreeInbreedingCoefficient({
        fBase: 0.125,
        pathContribution: 0.25,
      }),
    ).toEqual({ ok: true, output: { accumulatedInbreedingF: 0.34375 } }));
  it("starts from zero by default", () =>
    expect(
      runPedigreeInbreedingCoefficient({ pathContribution: 0.25 }),
    ).toEqual({ ok: true, output: { accumulatedInbreedingF: 0.25 } }));
  it("leaves the base unchanged for a zero contribution", () =>
    expect(
      runPedigreeInbreedingCoefficient({
        fBase: 0.4,
        pathContribution: 0,
      }),
    ).toEqual({ ok: true, output: { accumulatedInbreedingF: 0.4 } }));
  it("saturates at one for a full contribution", () =>
    expect(
      runPedigreeInbreedingCoefficient({
        fBase: 0.75,
        pathContribution: 1,
      }),
    ).toEqual({ ok: true, output: { accumulatedInbreedingF: 1 } }));
  it("clamps the result into the unit interval", () =>
    expect(
      runPedigreeInbreedingCoefficient({
        fBase: 1,
        pathContribution: 0.5,
      }),
    ).toEqual({ ok: true, output: { accumulatedInbreedingF: 1 } }));
  it("rejects a base coefficient above one", () => {
    const result = runPedigreeInbreedingCoefficient({
      fBase: 1.2,
      pathContribution: 0.1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects a contribution above one", () => {
    const result = runPedigreeInbreedingCoefficient({
      pathContribution: -0.1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("pathContribution");
  });
});
