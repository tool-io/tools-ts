import { describe, expect, it } from "vitest";
import { runSplit } from "./tool.js";
describe("Split Text Tool", () => {
  it("calculates a valid result", () => {
    expect(runSplit({ text: "a,b,c", delimiter: "," })).toEqual({
      ok: true,
      output: { parts: ["a", "b", "c"] },
    });
  });
  it("rejects invalid input", () => expect(runSplit(null).ok).toBe(false));
});
