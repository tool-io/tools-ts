import { describe, expect, it } from "vitest";
import { decimalToBcdExample, runDecimalToBcd } from "./tool.js";

describe("Decimal to BCD Converter", () => {
  it("calculates the canonical example", () =>
    expect(runDecimalToBcd(decimalToBcdExample.input)).toEqual({
      ok: true,
      output: decimalToBcdExample.output,
    }));

  it("encodes zero", () =>
    expect(runDecimalToBcd({ digits: "0" })).toEqual({
      ok: true,
      output: { bcd: "0000" },
    }));

  it("preserves leading zeros", () =>
    expect(runDecimalToBcd({ digits: "007" })).toEqual({
      ok: true,
      output: { bcd: "0000 0000 0111" },
    }));

  it("encodes every digit", () =>
    expect(runDecimalToBcd({ digits: "0123456789" })).toEqual({
      ok: true,
      output: {
        bcd: "0000 0001 0010 0011 0100 0101 0110 0111 1000 1001",
      },
    }));

  it("encodes nine", () =>
    expect(runDecimalToBcd({ digits: "9" })).toEqual({
      ok: true,
      output: { bcd: "1001" },
    }));

  it("rejects empty input", () => {
    const result = runDecimalToBcd({ digits: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_digits");
  });

  it("rejects non-digit characters", () => {
    const result = runDecimalToBcd({ digits: "1a9" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_digit");
  });

  it("rejects hexadecimal letters", () => {
    const result = runDecimalToBcd({ digits: "ff" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_digit");
  });

  it("rejects non-string input", () =>
    expect(runDecimalToBcd({ digits: 19 }).ok).toBe(false));

  it("rejects missing input", () => expect(runDecimalToBcd({}).ok).toBe(false));
});
