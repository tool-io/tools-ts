import { describe, expect, it } from "vitest";
import { runHexToOctal } from "./tool.js";

describe("Hex to Octal Converter", () => {
  it("calculates a valid result", () => {
    expect(runHexToOctal({ hex: "ff" })).toEqual({
      ok: true,
      output: { octal: "377" },
    });
    expect(runHexToOctal({ hex: "0" })).toEqual({
      ok: true,
      output: { octal: "0" },
    });
  });

  it("rejects invalid hex through execution", () => {
    expect(runHexToOctal({ hex: "g1" })).toMatchObject({
      error: { issues: [{ code: "invalid_hex" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () => expect(runHexToOctal(null).ok).toBe(false));
});
