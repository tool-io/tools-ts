import { describe, expect, it } from "vitest";
import { runActivity } from "./tool.js";

describe("Activity Calculator", () => {
  it("calculates a valid result", () => {
    const result = runActivity({ gammaCoefficient: 1, concentrationMolL: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.activity).toBeDefined();
  });
  it("rejects invalid input", () => expect(runActivity(null).ok).toBe(false));
});
