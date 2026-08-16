import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateMorseCode,
  morseCodeExample,
  morseCodeTool,
} from "./tool.js";

describe("Morse Code", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = morseCodeTool.execute(morseCodeExample.input);
    expect(result).toEqual({ ok: true, output: morseCodeExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(morseCodeTool.id).toBe("convert/morse-code");
    expect(validateToolContract(morseCodeTool)).toEqual([]);
  });

  it("round-trips words through slash-separated groups", () => {
    const encoded = calculateMorseCode({
      direction: "encode",
      text: "Morse code 2026",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    expect(encoded.output.converted).toBe(
      "-- --- .-. ... . / -.-. --- -.. . / ..--- ----- ..--- -....",
    );
    const decoded = calculateMorseCode({
      direction: "decode",
      text: encoded.output.converted,
    });
    expect(decoded.ok).toBe(true);
    if (decoded.ok)
      expect(decoded.output.converted).toBe("morse code 2026");
  });

  it("rejects unsupported characters and malformed signals", () => {
    expect(
      calculateMorseCode({ direction: "encode", text: "héllo" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateMorseCode({ direction: "decode", text: ".-.- ---" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateMorseCode({ direction: "sideways", text: "x" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateMorseCode({ direction: "encode", text: "   " }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(calculateMorseCode(null)).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
