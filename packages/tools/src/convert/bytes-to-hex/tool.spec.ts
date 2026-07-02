import { describe, expect, it } from "vitest";
import { runBytesToHex } from "./tool.js";
describe("Bytes to Hex Converter", () => {
  it("calculates a valid result", () => {
    expect(runBytesToHex({ bytes: "SGk=" })).toEqual({
      ok: true,
      output: { hex: "4869" },
    });
  });
  it("rejects invalid input", () => expect(runBytesToHex(null).ok).toBe(false));
});
