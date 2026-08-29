import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("convert/magnetic-flux", () => {
  it("converts the canonical reference", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("round-trips a supported unit", () => {
    const forward = tool.execute({ fromUnit: "Wb", toUnit: "Mx", value: 1 });
    expect(forward.ok).toBe(true);
    if (!forward.ok) return;
    const back = tool.execute({
      fromUnit: "Mx",
      toUnit: "Wb",
      value: forward.output.value,
    });
    expect(back.ok).toBe(true);
    if (back.ok) expect(back.output.value).toBeCloseTo(1, 8);
  });
});
