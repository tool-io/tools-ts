import { describe, expect, it } from "vitest";
import {
  yeastInoculationRateExample,
  yeastInoculationRateTool,
  runYeastInoculationRate,
} from "./tool.js";

describe("yeastInoculationRateTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runYeastInoculationRate(yeastInoculationRateExample.input)).toEqual({
      ok: true,
      output: yeastInoculationRateExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(yeastInoculationRateExample))).toEqual(
      yeastInoculationRateExample,
    );
    expect(yeastInoculationRateTool.contractVersion).toBe(1);
    expect(yeastInoculationRateTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runYeastInoculationRate(null).ok).toBe(false);
    expect(
      runYeastInoculationRate({
        ...yeastInoculationRateExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
