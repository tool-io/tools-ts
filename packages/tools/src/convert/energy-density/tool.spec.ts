import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("convert/energy-density", () => {
  it("converts the reference", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.unit).toBe(example.output.unit);
      expect(result.output.value).toBeCloseTo(example.output.value, 8);
    }
  });
  it("rejects incompatible dimensions", () => {
    expect(
      tool.execute({ fromUnit: "kJ/m²", toUnit: "J/m³", value: 1 }).ok,
    ).toBe(false);
  });
  it("preserves a large finite value when conversion factors would overflow an intermediate", () => {
    expect(
      tool.execute({ fromUnit: "Wh/L", toUnit: "Wh/L", value: 1e308 }),
    ).toEqual({ ok: true, output: { unit: "Wh/L", value: 1e308 } });
  });
});
