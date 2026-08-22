import { describe, expect, it } from "vitest";
import { runRhombusArea } from "./tool.js";
describe("rhombus area calculator", () => {
  it("computes (6×8)/2 = 24", () => {
    const r = runRhombusArea({ d1: 6, d2: 8 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.area).toBe(24);
  });
});
