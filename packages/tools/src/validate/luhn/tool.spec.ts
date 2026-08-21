import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateLuhnCheck,
  luhnCheckExample,
  luhnCheckTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateLuhnCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Luhn Checksum Validator", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = luhnCheckTool.execute(luhnCheckExample.input);
    expect(result).toEqual({ ok: true, output: luhnCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(luhnCheckTool.id).toBe("validate/luhn");
    expect(validateToolContract(luhnCheckTool)).toEqual([]);
  });

  it("accepts known-valid numbers and rejects failing checksums", () => {
    expect(calculateLuhnCheck({ value: "79927398713" })).toMatchObject({
      ok: true,
      output: { digitCount: 11, valid: true },
    });
    expect(
      calculateLuhnCheck({ value: "4532015112830367" }),
    ).toMatchObject({ ok: true, output: { digitCount: 16, valid: false } });
  });

  it("ignores spaces and hyphens during normalization", () => {
    const result = calculateLuhnCheck({ value: "7992-7398 713" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.valid).toBe(true);
      expect(result.output.digitCount).toBe(11);
    }
  });

  it("rejects malformed inputs with precise codes", () => {
    expect(calculateLuhnCheck(null).ok).toBe(false);
    expect(issueCodes(calculateLuhnCheck({}))).toEqual(["value_required"]);
    expect(issueCodes(calculateLuhnCheck({ value: "12a34" }))).toEqual([
      "digits_required",
    ]);
    expect(issueCodes(calculateLuhnCheck({ value: "5" }))).toEqual([
      "length_invalid",
    ]);
    expect(issueCodes(calculateLuhnCheck({ value: 42 }))).toEqual([
      "value_invalid",
    ]);
    expect(issueCodes(calculateLuhnCheck({ extra: 1, value: "12" }))).toEqual([
      "unknown_field",
    ]);
  });
});
