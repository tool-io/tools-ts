import { describe, expect, it } from "vitest";
import {
  dmsToDecimalDegreesExample,
  calculateDmsToDecimalDegrees,
  runDmsToDecimalDegrees,
} from "./tool.js";

describe("convert/dms-to-decimal-degrees", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDmsToDecimalDegrees(dmsToDecimalDegreesExample.input)).toEqual({
      ok: true,
      output: dmsToDecimalDegreesExample.output,
    });
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runDmsToDecimalDegrees({ minutes: 60 }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runDmsToDecimalDegrees({ seconds: 60 }).ok).toBe(false);
  });
  it("rejects invalid input (out_of_range)", () => {
    expect(runDmsToDecimalDegrees({ degrees: -200 }).ok).toBe(false);
  });
  it("applies southern and western signs", () => {
    const south = runDmsToDecimalDegrees({
      degrees: 33,
      minutes: 51,
      seconds: 54,
      hemisphere: "S",
    });
    const west = runDmsToDecimalDegrees({
      degrees: 151,
      minutes: 12,
      seconds: 36,
      hemisphere: "W",
    });
    expect(south.ok && (south.output.decimalDegrees as number)).toBeLessThan(0);
    expect(west.ok && (west.output.decimalDegrees as number)).toBeLessThan(0);
  });
});
