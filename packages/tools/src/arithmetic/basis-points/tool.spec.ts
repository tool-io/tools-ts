import { describe, expect, it } from "vitest";
import { runBasisPoints } from "./tool.js";
describe("basis points calculator", () => {
  it("converts 1.5% to 150 bp", () => {
    const r = runBasisPoints({ percent: 1.5 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.basisPoints).toBe(150);
  });
  it("returns zero for zero percent", () => {
    const r = runBasisPoints({ percent: 0 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.basisPoints).toBe(0);
  });
});
