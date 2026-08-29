import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("convert/surface-linear-density", () => {
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
      tool.execute({ fromUnit: "g/m²", toUnit: "kg/m", value: 1 }).ok,
    ).toBe(false);
  });
});
