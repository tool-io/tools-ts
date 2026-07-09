import { describe, expect, it } from "vitest";
import { runByteCount } from "./tool.js";
describe("Text Byte Count Tool", () => {
  it("calculates a valid result", () => {
    expect(runByteCount({ text: "é" })).toEqual({
      ok: true,
      output: { bytes: 2 },
    });
  });
  it("rejects invalid input", () => expect(runByteCount(null).ok).toBe(false));
});
