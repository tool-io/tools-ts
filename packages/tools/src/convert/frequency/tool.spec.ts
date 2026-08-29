import { describe, expect, it } from "vitest";
import { frequencyExample, runFrequency } from "./tool.js";

describe("frequency converter", () => {
  it("reproduces its revolutions-per-minute example", () => {
    expect(runFrequency(frequencyExample.input)).toEqual({
      ok: true,
      output: frequencyExample.output,
    });
  });

  it("converts megahertz to hertz", () => {
    expect(runFrequency({ fromUnit: "MHz", toUnit: "Hz", value: 2.4 })).toEqual(
      { ok: true, output: { unit: "Hz", value: 2_400_000 } },
    );
  });

  it("rejects a non-finite value", () => {
    expect(
      runFrequency({ fromUnit: "Hz", toUnit: "kHz", value: Infinity }).ok,
    ).toBe(false);
  });
});
