import { describe, expect, it } from "vitest";
import { octalToHexExample, runOctalToHex } from "./tool.js";

describe("Octal to Hex Converter", () => {
  it("runs the canonical example", () => {
    expect(runOctalToHex(octalToHexExample.input)).toEqual({
      ok: true,
      output: octalToHexExample.output,
    });
  });

  it("calculates a valid result", () => {
    expect(runOctalToHex({ octal: "377" })).toEqual({
      ok: true,
      output: { hex: "ff" },
    });
  });

  it("rejects invalid octal through execution", () => {
    expect(runOctalToHex({ octal: "18" })).toMatchObject({
      error: { issues: [{ code: "invalid_octal" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () => expect(runOctalToHex(null).ok).toBe(false));
});
