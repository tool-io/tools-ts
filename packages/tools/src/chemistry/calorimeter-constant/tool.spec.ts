import { describe, expect, it } from "vitest";
import { runCalorimeterConstant } from "./tool.js";

describe("Calorimeter Constant Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCalorimeterConstant({ heatJoules: 1, deltaTK: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.calorimeterConstantJK).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCalorimeterConstant(null).ok).toBe(false));
});
