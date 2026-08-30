import { describe, expect, it } from "vitest";
import {
  runVariablesSamplingSelector,
  selectVariablesSamplingMethod,
  variablesSamplingSelectorExample,
} from "./tool.js";

describe("variables sampling method selector", () => {
  it("reproduces its canonical example", () => {
    expect(
      runVariablesSamplingSelector(variablesSamplingSelectorExample.input),
    ).toEqual({
      ok: true,
      output: variablesSamplingSelectorExample.output,
    });
  });

  it("selects ratio for heterogeneous populations without expected differences", () => {
    expect(
      selectVariablesSamplingMethod({
        differenceExpected: false,
        hasReliableBookValue: true,
        hasReliableExpectedValue: true,
        populationHomogeneous: false,
        varianceHigh: true,
      }).method,
    ).toBe("ratio");
  });

  it("does not support selection without reliable expected values", () => {
    expect(
      selectVariablesSamplingMethod({
        differenceExpected: true,
        hasReliableBookValue: true,
        hasReliableExpectedValue: false,
        populationHomogeneous: true,
        varianceHigh: false,
      }),
    ).toEqual({ method: "not_supported", supported: false });
  });

  it("requires judgment for mixed selection facts", () => {
    expect(
      selectVariablesSamplingMethod({
        differenceExpected: false,
        hasReliableBookValue: true,
        hasReliableExpectedValue: true,
        populationHomogeneous: true,
        varianceHigh: false,
      }).method,
    ).toBe("judgment_required");
  });
});
