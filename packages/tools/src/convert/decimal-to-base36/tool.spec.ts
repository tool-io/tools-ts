import { describe, expect, it } from "vitest";
import { decimalToBase36Example, runDecimalToBase36 } from "./tool.js";

describe("Decimal to Base36 Converter", () => {
  it("calculates the canonical example", () =>
    expect(runDecimalToBase36(decimalToBase36Example.input)).toEqual({
      ok: true,
      output: decimalToBase36Example.output,
    }));

  it("maps zero to the zero digit", () =>
    expect(runDecimalToBase36({ value: 0 })).toEqual({
      ok: true,
      output: { base36: "0" },
    }));

  it("uses letters after nine", () =>
    expect(runDecimalToBase36({ value: 10 })).toEqual({
      ok: true,
      output: { base36: "a" },
    }));

  it("maps the largest single digit", () =>
    expect(runDecimalToBase36({ value: 35 })).toEqual({
      ok: true,
      output: { base36: "z" },
    }));

  it("carries into a second digit at the base", () =>
    expect(runDecimalToBase36({ value: 36 })).toEqual({
      ok: true,
      output: { base36: "10" },
    }));

  it("handles the maximum safe integer", () =>
    expect(runDecimalToBase36({ value: Number.MAX_SAFE_INTEGER })).toEqual({
      ok: true,
      output: { base36: "2gosa7pa2gv" },
    }));

  it("rejects negative values", () => {
    const result = runDecimalToBase36({ value: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-integer values", () =>
    expect(runDecimalToBase36({ value: 1.5 }).ok).toBe(false));

  it("rejects missing input", () =>
    expect(runDecimalToBase36({}).ok).toBe(false));
});
