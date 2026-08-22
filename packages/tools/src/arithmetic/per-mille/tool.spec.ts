import { describe, expect, it } from "vitest";
import { runPerMille } from "./tool.js";
describe("per mille calculator", () => {
  it("converts 500 to 0.5", () => {
    const r = runPerMille({ perMille: 500 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.decimal).toBe(0.5);
  });
  it("returns zero for zero input", () => {
    const r = runPerMille({ perMille: 0 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.decimal).toBe(0);
  });
});
