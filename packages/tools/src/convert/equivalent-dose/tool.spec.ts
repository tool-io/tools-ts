import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("convert/equivalent-dose", () => {
  it("converts the canonical reference", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("round-trips a supported unit", () => {
    const forward = tool.execute({ fromUnit: "rem", toUnit: "Sv", value: 100 });
    expect(forward.ok).toBe(true);
    if (!forward.ok) return;
    const back = tool.execute({
      fromUnit: "Sv",
      toUnit: "rem",
      value: forward.output.value,
    });
    expect(back.ok).toBe(true);
    if (back.ok) expect(back.output.value).toBeCloseTo(100, 8);
  });
});
