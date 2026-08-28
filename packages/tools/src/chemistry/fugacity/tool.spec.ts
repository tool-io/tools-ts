import { describe, expect, it } from "vitest";
import { runFugacity } from "./tool.js";

describe("Fugacity Calculator", () => {
  it("calculates a valid result", () => {
    const result = runFugacity({ phiCoefficient: 1, pressureAtm: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.fugacityAtm).toBeDefined();
  });
  it("rejects invalid input", () => expect(runFugacity(null).ok).toBe(false));
});
