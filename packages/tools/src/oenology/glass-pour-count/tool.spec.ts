import { describe, expect, it } from "vitest";
import {
  glassPourCountExample,
  glassPourCountTool,
  runGlassPourCount,
} from "./tool.js";

describe("glassPourCountTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runGlassPourCount(glassPourCountExample.input)).toEqual({
      ok: true,
      output: glassPourCountExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(glassPourCountExample))).toEqual(
      glassPourCountExample,
    );
    expect(glassPourCountTool.contractVersion).toBe(1);
    expect(glassPourCountTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runGlassPourCount(null).ok).toBe(false);
    expect(
      runGlassPourCount({ ...glassPourCountExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });

  it("separates exact equivalents from whole servings", () => {
    expect(runGlassPourCount({ bottleMl: 750, pourMl: 200 })).toEqual({
      ok: true,
      output: { poursPerBottle: 3.75, wholePours: 3 },
    });
  });
});
