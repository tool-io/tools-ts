import { describe, expect, it } from "vitest";
import { runTextToBytes } from "./tool.js";
describe("UTF-8 Text to Bytes Converter", () => {
  it("calculates a valid result", () => {
    expect(runTextToBytes({ text: "Hi" })).toEqual({
      ok: true,
      output: { bytes: "SGk=" },
    });
  });
  it("rejects invalid input", () =>
    expect(runTextToBytes(null).ok).toBe(false));
});
