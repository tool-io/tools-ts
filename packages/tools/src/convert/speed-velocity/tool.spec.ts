import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("speed conversion", () => {
  it("converts knots and Mach with a stated speed of sound", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.value).toBeCloseTo(example.output.value, 12);
    expect(
      tool.execute({
        fromUnit: "Mach",
        toUnit: "m/s",
        value: 1,
        speedOfSoundMetersPerSecond: 300,
      }),
    ).toEqual({ ok: true, output: { unit: "m/s", value: 300 } });
  });
});
