import { describe, expect, it } from "vitest";
import {
  mlfInoculationRateExample,
  mlfInoculationRateTool,
  runMlfInoculationRate,
} from "./tool.js";

describe("mlfInoculationRateTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMlfInoculationRate(mlfInoculationRateExample.input)).toEqual({
      ok: true,
      output: mlfInoculationRateExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(mlfInoculationRateExample))).toEqual(
      mlfInoculationRateExample,
    );
    expect(mlfInoculationRateTool.contractVersion).toBe(1);
    expect(mlfInoculationRateTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMlfInoculationRate(null).ok).toBe(false);
    expect(
      runMlfInoculationRate({
        ...mlfInoculationRateExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
