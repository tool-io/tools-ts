import { describe, expect, it } from "vitest";
import { decimalToRomanExample, runDecimalToRoman } from "./tool.js";
describe("decimal to roman converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDecimalToRoman(decimalToRomanExample.input)).toEqual({
      ok: true,
      output: decimalToRomanExample.output,
    });
  });
  it("handles boundary values", () => {
    const r1 = runDecimalToRoman({ value: 1 });
    if (!r1.ok) throw new Error("expected success");
    expect(r1.output.roman).toBe("I");
    const r2 = runDecimalToRoman({ value: 3999 });
    if (!r2.ok) throw new Error("expected success");
    expect(r2.output.roman).toBe("MMMCMXCIX");
  });
});
