import { describe, expect, it } from "vitest";
import {
  anthocyaninColorDensityExample,
  anthocyaninColorDensityTool,
  runAnthocyaninColorDensity,
} from "./tool.js";

describe("anthocyaninColorDensityTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runAnthocyaninColorDensity(anthocyaninColorDensityExample.input)).toEqual({
      ok: true,
      output: anthocyaninColorDensityExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(anthocyaninColorDensityExample))).toEqual(anthocyaninColorDensityExample);
    expect(anthocyaninColorDensityTool.contractVersion).toBe(1);
    expect(anthocyaninColorDensityTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAnthocyaninColorDensity(null).ok).toBe(false);
    expect(
      runAnthocyaninColorDensity({ ...anthocyaninColorDensityExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
