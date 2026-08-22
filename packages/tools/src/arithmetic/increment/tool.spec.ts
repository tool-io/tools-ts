import { describe, expect, it } from "vitest";
import { runIncrement } from "./tool.js";

describe("Increment Number", () => {
  it("calculates a valid result", () => {
    const result = runIncrement({ value: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.result).toBeDefined();
  });
  it("rejects invalid input", () => expect(runIncrement(null).ok).toBe(false));
});
