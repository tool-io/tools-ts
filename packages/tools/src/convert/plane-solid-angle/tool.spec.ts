import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("convert/plane-solid-angle", () => {
  it("converts the reference", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.unit).toBe(example.output.unit);
      expect(result.output.value).toBeCloseTo(example.output.value, 8);
    }
  });
  it("rejects incompatible dimensions", () => {
    expect(tool.execute({ fromUnit: "deg", toUnit: "sr", value: 1 }).ok).toBe(
      false,
    );
  });
});
