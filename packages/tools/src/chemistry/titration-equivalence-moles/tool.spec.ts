import { describe, expect, it } from "vitest";
import { runTitrationEquivalenceMoles } from "./tool.js";

describe("Titration Equivalence Moles Calculator", () => {
  it("calculates a monoprotic-monobasic case", () => {
    expect(
      runTitrationEquivalenceMoles({
        acidProtons: 1,
        analyteMoles: 0.025,
        baseHydroxides: 1,
      }),
    ).toEqual({ ok: true, output: { titrantMoles: 0.025 } });
  });

  it("handles diprotic acid with monobasic base", () => {
    expect(
      runTitrationEquivalenceMoles({
        acidProtons: 2,
        analyteMoles: 0.01,
        baseHydroxides: 1,
      }),
    ).toEqual({ ok: true, output: { titrantMoles: 0.02 } });
  });

  it("rejects invalid input", () =>
    expect(runTitrationEquivalenceMoles(null).ok).toBe(false));
});
