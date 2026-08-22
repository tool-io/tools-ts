import { describe, expect, it } from "vitest";
import { runCatalanNumber } from "./tool.js";

describe("catalan number calculator", () => {
  it("computes C(5) = 42", () => {
    const r = runCatalanNumber({ n: 5 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.catalanNumber).toBe(42);
  });
  it("returns C(0) = 1", () => {
    const r = runCatalanNumber({ n: 0 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.catalanNumber).toBe(1);
  });
  it("accepts the boundary n = 30", () => {
    expect(runCatalanNumber({ n: 30 })).toEqual({
      ok: true,
      output: { catalanNumber: 3814986502092304 },
    });
  });
  it("rejects n = 31", () => {
    expect(runCatalanNumber({ n: 31 }).ok).toBe(false);
  });
  it("rejects negative input", () => {
    expect(runCatalanNumber({ n: -1 }).ok).toBe(false);
  });
});
