import { describe, expect, it } from "vitest";
import { runRelativeRisk } from "./tool.js";
describe("Relative Risk Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runRelativeRisk({
        exposedEvents: 20,
        exposedTotal: 100,
        controlEvents: 10,
        controlTotal: 100,
      }),
    ).toEqual({ ok: true, output: { relativeRisk: 2 } });
  });
  it("rejects invalid input", () =>
    expect(runRelativeRisk(null).ok).toBe(false));
});
