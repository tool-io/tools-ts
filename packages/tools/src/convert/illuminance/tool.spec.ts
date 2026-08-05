import { describe, expect, it } from "vitest";
import {
  convertIlluminance,
  illuminanceExample,
  runIlluminance,
} from "./tool.js";

describe("Convert Illuminance", () => {
  it("converts the canonical example", () =>
    expect(
      convertIlluminance(
        illuminanceExample.input.value,
        illuminanceExample.input.fromUnit,
        illuminanceExample.input.toUnit,
      ),
    ).toBeCloseTo(illuminanceExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertIlluminance(3, "lx", "lx")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertIlluminance(1, "unknown", "lx")).toBeNull();
    expect(convertIlluminance(Number.NaN, "lx", "lx")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runIlluminance(illuminanceExample.input)).toEqual({
      ok: true,
      output: illuminanceExample.output,
    }));
});
