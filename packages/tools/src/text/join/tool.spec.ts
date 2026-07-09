import { describe, expect, it } from "vitest";
import { runJoin } from "./tool.js";
describe("String Join Tool", () => {
  it("calculates a valid result", () => {
    expect(runJoin({ parts: ["a", "b", "c"], separator: "," })).toEqual({
      ok: true,
      output: { text: "a,b,c" },
    });
  });
  it("rejects invalid input", () => expect(runJoin(null).ok).toBe(false));
});
