import { describe, expect, it } from "vitest";
import { runReplaceLiteral } from "./tool.js";
describe("Text Replace Literal Tool", () => {
  it("calculates a valid result", () => {
    expect(
      runReplaceLiteral({ text: "one one", search: "one", replacement: "two" }),
    ).toEqual({ ok: true, output: { text: "two two" } });
  });
  it("rejects invalid input", () =>
    expect(runReplaceLiteral(null).ok).toBe(false));
});
