import { describe, expect, it } from "vitest";
import { runQcVsKcChecker } from "./tool.js";

describe("Qc vs Kc Checker", () => {
  it("classifies forward, reverse, and equilibrium cases", () => {
    const forward = runQcVsKcChecker({ kc: 2, qc: 1 });
    const reverse = runQcVsKcChecker({ kc: 1, qc: 2 });
    const equilibrium = runQcVsKcChecker({ kc: 1, qc: 1 });
    if (!forward.ok || !reverse.ok || !equilibrium.ok)
      throw new Error("expected success");
    expect(forward.output).toMatchObject({
      direction: "forward (toward products)",
    });
    expect(reverse.output).toMatchObject({
      direction: "reverse (toward reactants)",
    });
    expect(equilibrium.output).toMatchObject({
      direction: "at equilibrium",
    });
  });

  it("rejects invalid input", () =>
    expect(runQcVsKcChecker(null).ok).toBe(false));
});
