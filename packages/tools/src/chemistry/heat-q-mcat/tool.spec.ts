import { describe, expect, it } from "vitest";
import { runHeatQMcat } from "./tool.js";

describe("Heat Q MCAT Calculator", () => {
  it("calculates a valid result", () => {
    const result = runHeatQMcat({ deltaTK: 1, massG: 1, specificHeatJGK: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.heatJoules).toBeDefined();
  });
  it("rejects invalid input", () => expect(runHeatQMcat(null).ok).toBe(false));
});
