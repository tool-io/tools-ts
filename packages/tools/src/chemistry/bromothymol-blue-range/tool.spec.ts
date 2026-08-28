import { describe, expect, it } from "vitest";
import { runBromothymolBlueRange } from "./tool.js";

describe("Bromothymol Blue Range Checker", () => {
  it("calculates a valid result", () => {
    const result = runBromothymolBlueRange({ ph: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.inRange).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runBromothymolBlueRange(null).ok).toBe(false));
});
