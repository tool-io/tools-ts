import { describe, expect, it } from "vitest";
import {
  colorHueAngleExample,
  colorHueAngleTool,
  runColorHueAngle,
} from "./tool.js";

describe("colorHueAngleTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runColorHueAngle(colorHueAngleExample.input)).toEqual({
      ok: true,
      output: colorHueAngleExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(colorHueAngleExample))).toEqual(
      colorHueAngleExample,
    );
    expect(colorHueAngleTool.contractVersion).toBe(1);
    expect(colorHueAngleTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runColorHueAngle(null).ok).toBe(false);
    expect(
      runColorHueAngle({ ...colorHueAngleExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});
