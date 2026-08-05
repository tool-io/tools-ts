import { describe, expect, it } from "vitest";
import { convertVolume, volumeExample, runVolume } from "./tool.js";

describe("Convert Volume", () => {
  it("converts the canonical example", () =>
    expect(
      convertVolume(
        volumeExample.input.value,
        volumeExample.input.fromUnit,
        volumeExample.input.toUnit,
      ),
    ).toBeCloseTo(volumeExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertVolume(3, "l", "l")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertVolume(1, "unknown", "l")).toBeNull();
    expect(convertVolume(Number.NaN, "l", "l")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runVolume(volumeExample.input)).toEqual({
      ok: true,
      output: volumeExample.output,
    }));
});
