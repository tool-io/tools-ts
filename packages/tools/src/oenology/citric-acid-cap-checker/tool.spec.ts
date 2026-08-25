import { describe, expect, it } from "vitest";
import {
  citricAcidCapCheckerExample,
  citricAcidCapCheckerTool,
  runCitricAcidCapChecker,
} from "./tool.js";

describe("citricAcidCapCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCitricAcidCapChecker(citricAcidCapCheckerExample.input)).toEqual({
      ok: true,
      output: citricAcidCapCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(citricAcidCapCheckerExample))).toEqual(
      citricAcidCapCheckerExample,
    );
    expect(citricAcidCapCheckerTool.contractVersion).toBe(1);
    expect(citricAcidCapCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCitricAcidCapChecker(null).ok).toBe(false);
    expect(
      runCitricAcidCapChecker({
        ...citricAcidCapCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
