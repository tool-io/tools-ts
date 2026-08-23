import { describe, expect, it } from "vitest";
import {
  decimalDegreesToDmsExample,
  calculateDecimalDegreesToDms,
  runDecimalDegreesToDms,
} from "./tool.js";

describe("convert/decimal-degrees-to-dms", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDecimalDegreesToDms(decimalDegreesToDmsExample.input)).toEqual({
      ok: true,
      output: decimalDegreesToDmsExample.output,
    });
  });
  it("rejects invalid input (out_of_range)", () => {
    expect(runDecimalDegreesToDms({ degrees: 200 }).ok).toBe(false);
  });
  it("round-trips against dms-to-decimal-degrees", () => {
    const result = runDecimalDegreesToDms({
      degrees: 40.7128,
      axis: "latitude",
    });
    expect(result.ok && result.output.direction).toBe("N");
  });
});
