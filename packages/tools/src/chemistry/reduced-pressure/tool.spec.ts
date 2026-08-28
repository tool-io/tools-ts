import { describe, expect, it } from "vitest";
import { runReducedPressure } from "./tool.js";
describe("Reduced Pressure Calculator", () => {
  it("100/50 gives Pr=2", () => {
    expect(runReducedPressure({ criticalPressure: 50, pressure: 100 })).toEqual(
      { ok: true, output: { reducedPressure: 2 } },
    );
  });
  it("rejects invalid input", () =>
    expect(runReducedPressure(null).ok).toBe(false));
});
