import { describe, expect, it } from "vitest";
import {
  affineCipherExample,
  encodeAffine,
  gcd,
  runAffineCipher,
} from "./tool.js";

describe("Affine Cipher Encoder", () => {
  it("matches the known transformation", () =>
    expect(encodeAffine("AFFINE", 5, 8)).toBe("IHHWVC"));
  it("publishes an executable example", () =>
    expect(runAffineCipher(affineCipherExample.input)).toEqual({
      ok: true,
      output: affineCipherExample.output,
    }));
  it("mirrors lowercase letters", () =>
    expect(
      runAffineCipher({ multiplierA: 5, shiftB: 8, text: "affine" }),
    ).toEqual({ ok: true, output: { encoded: "ihhwvc" } }));
  it("leaves non-letters unchanged", () =>
    expect(
      runAffineCipher({ multiplierA: 5, shiftB: 8, text: "Hi, x9!" }),
    ).toEqual({
      ok: true,
      output: { encoded: "Rw, t9!" },
    }));
  it("wraps around the alphabet", () =>
    expect(
      runAffineCipher({ multiplierA: 7, shiftB: 20, text: "ZzYy" }),
    ).toEqual({
      ok: true,
      output: { encoded: "NnGg" },
    }));
  it("rejects a non-coprime multiplier", () => {
    const outcome = runAffineCipher({ multiplierA: 13, shiftB: 4, text: "a" });
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("invalid_input");
      expect(outcome.error.issues[0]?.code).toBe("not_coprime");
      expect(outcome.error.issues[0]?.field).toBe("multiplierA");
    }
  });
  it("rejects every non-coprime multiplier", () => {
    for (const multiplier of [0, 2, 4, 6, 13])
      expect(
        runAffineCipher({ multiplierA: multiplier, shiftB: 0, text: "x" }).ok,
      ).toBe(false);
  });
  it("accepts every coprime multiplier", () => {
    for (const multiplier of [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]) {
      const outcome = runAffineCipher({
        multiplierA: multiplier,
        shiftB: 1,
        text: "abc",
      });
      expect(outcome.ok).toBe(true);
    }
  });
  it("computes gcd correctly", () => {
    expect(gcd(26, 5)).toBe(1);
    expect(gcd(26, 2)).toBe(2);
    expect(gcd(13, 26)).toBe(13);
  });
  it("rejects out-of-range multipliers", () =>
    expect(runAffineCipher({ multiplierA: 26, shiftB: 0, text: "a" }).ok).toBe(
      false,
    ));
  it("rejects non-integer shifts", () =>
    expect(runAffineCipher({ multiplierA: 1, shiftB: 0.5, text: "a" }).ok).toBe(
      false,
    ));
  it("rejects missing text", () =>
    expect(runAffineCipher({ multiplierA: 1, shiftB: 0 }).ok).toBe(false));
});
