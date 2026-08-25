import { describe, expect, it } from "vitest";
import {
  glycerolEstimateAbvExample,
  glycerolEstimateAbvTool,
  runGlycerolEstimateAbv,
} from "./tool.js";

describe("glycerolEstimateAbvTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runGlycerolEstimateAbv(glycerolEstimateAbvExample.input)).toEqual({
      ok: true,
      output: glycerolEstimateAbvExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(glycerolEstimateAbvExample))).toEqual(
      glycerolEstimateAbvExample,
    );
    expect(glycerolEstimateAbvTool.contractVersion).toBe(1);
    expect(glycerolEstimateAbvTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runGlycerolEstimateAbv(null).ok).toBe(false);
    expect(
      runGlycerolEstimateAbv({
        ...glycerolEstimateAbvExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("uses the supplied fermentation calibration", () => {
    expect(
      runGlycerolEstimateAbv({
        abvPercent: 12,
        glycerolGPerLPerAbvPoint: 0.6,
      }),
    ).toEqual({ ok: true, output: { glycerolGPerL: 7.2 } });
  });
});
