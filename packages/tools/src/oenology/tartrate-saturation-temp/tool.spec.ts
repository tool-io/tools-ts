import { describe, expect, it } from "vitest";
import {
  tartrateSaturationTempExample,
  tartrateSaturationTempTool,
  runTartrateSaturationTemp,
} from "./tool.js";

describe("tartrateSaturationTempTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runTartrateSaturationTemp(tartrateSaturationTempExample.input),
    ).toEqual({
      ok: true,
      output: tartrateSaturationTempExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(tartrateSaturationTempExample))).toEqual(
      tartrateSaturationTempExample,
    );
    expect(tartrateSaturationTempTool.contractVersion).toBe(1);
    expect(tartrateSaturationTempTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTartrateSaturationTemp(null).ok).toBe(false);
    expect(
      runTartrateSaturationTemp({
        ...tartrateSaturationTempExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
