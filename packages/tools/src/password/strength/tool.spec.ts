import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculatePasswordStrength,
  passwordStrengthExample,
  passwordStrengthTool,
} from "./tool.js";

describe("Password Strength", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = passwordStrengthTool.execute(passwordStrengthExample.input);
    expect(result).toEqual({ ok: true, output: passwordStrengthExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(passwordStrengthTool.id).toBe("password/strength");
    expect(validateToolContract(passwordStrengthTool)).toEqual([]);
  });

  it("detects pool sizes per character class", () => {
    for (const [password, pool] of [
      ["alllowercase", 26],
      ["LOWER", 26],
      ["12345678", 10],
      ["!@#$%^&*", 32],
      ["Mixed123!", 94],
    ] as const) {
      const result = calculatePasswordStrength({ password });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.characterPoolSize).toBe(pool);
    }
  });

  it("bands longer mixed passwords above short weak ones", () => {
    const weak = calculatePasswordStrength({ password: "abc" });
    const strong = calculatePasswordStrength({
      password: "correct horse battery staple",
    });
    expect(weak.ok).toBe(true);
    expect(strong.ok).toBe(true);
    if (weak.ok && strong.ok) {
      expect(weak.output.band).toBe("very-poor");
      expect(strong.output.band).toBe("excellent");
      expect(strong.output.entropyBits).toBeGreaterThan(
        weak.output.entropyBits,
      );
    }
  });

  it("rejects malformed probes", () => {
    expect(calculatePasswordStrength(null).ok).toBe(false);
    expect(calculatePasswordStrength({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculatePasswordStrength({ password: "" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculatePasswordStrength({ password: 42 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculatePasswordStrength({ extra: true, password: "x" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
