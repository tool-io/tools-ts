import { describe, expect, it } from "vitest";
import { runDecrement } from "./tool.js";

describe("Decrement Number", () => {
  it("calculates a valid result", () => {
    const result = runDecrement({ value: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.result).toBeDefined();
  });
  it("rejects invalid input", () => expect(runDecrement(null).ok).toBe(false));
});
