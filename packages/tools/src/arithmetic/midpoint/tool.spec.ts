import { describe, expect, it } from "vitest";
import { runMidpoint } from "./tool.js";
describe("midpoint calculator", () => {
  it("computes midpoint of 3 and 7 as 5", () => {
    const r = runMidpoint({ a: 3, b: 7 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.midpoint).toBe(5);
  });
  it("handles negative values", () => {
    const r = runMidpoint({ a: -4, b: 2 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.midpoint).toBe(-1);
  });
});
