import { describe, expect, it } from "vitest";
import { runAsciiHexEncode } from "./tool.js";

describe("ASCII Hex Encoder", () => {
  it("calculates a valid result", () => {
    expect(runAsciiHexEncode({ text: "Hi" })).toEqual({
      ok: true,
      output: { hex: "4869" },
    });
  });

  it("encodes multi-byte characters", () => {
    expect(runAsciiHexEncode({ text: "é" })).toEqual({
      ok: true,
      output: { hex: "c3a9" },
    });
  });

  it("rejects empty text through execution", () => {
    expect(runAsciiHexEncode({ text: "" })).toMatchObject({
      error: { issues: [{ code: "empty_text" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runAsciiHexEncode(null).ok).toBe(false));
});
