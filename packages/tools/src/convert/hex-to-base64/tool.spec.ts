import { describe, expect, it } from "vitest";
import { hexToBase64Example, runHexToBase64 } from "./tool.js";

describe("Hex to Base64 Converter", () => {
  it("runs the canonical example", () => {
    expect(runHexToBase64(hexToBase64Example.input)).toEqual({
      ok: true,
      output: hexToBase64Example.output,
    });
  });

  it("calculates a valid result", () => {
    expect(runHexToBase64({ hex: "54657374" })).toEqual({
      ok: true,
      output: { base64: "VGVzdA==" },
    });
    expect(runHexToBase64({ hex: "49276d" })).toEqual({
      ok: true,
      output: { base64: "SSdt" },
    });
  });

  it("rejects odd-length hex through execution", () => {
    expect(runHexToBase64({ hex: "abc" })).toMatchObject({
      error: { issues: [{ code: "invalid_hex" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runHexToBase64(null).ok).toBe(false));
});
