import { describe, expect, it } from "vitest";
import { runNegate } from "./tool.js";

describe("Negate Number", () => {
  it("calculates a valid result", () => {
    const result = runNegate({ value: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.negated).toBeDefined();
  });
  it("rejects invalid input", () => expect(runNegate(null).ok).toBe(false));
});
