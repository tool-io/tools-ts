import { describe, expect, it } from "vitest";
import { runBackTitration } from "./tool.js";

describe("Back Titration Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBackTitration({
      initialTitrantMoles: 1,
      backTitrantMoles: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.analyteMoles).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runBackTitration(null).ok).toBe(false));
});
