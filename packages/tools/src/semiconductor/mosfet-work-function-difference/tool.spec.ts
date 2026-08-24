import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateMosfetWorkFunctionDifference,
  mosfetWorkFunctionDifferenceExample,
  runMosfetWorkFunctionDifference,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("Work Function Difference Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMosfetWorkFunctionDifference(
        mosfetWorkFunctionDifferenceExample.input,
      ),
    ).toEqual({ ok: true, output: mosfetWorkFunctionDifferenceExample.output });
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(mosfetWorkFunctionDifferenceExample),
    ) as typeof mosfetWorkFunctionDifferenceExample;
    expect(roundTrip).toEqual(mosfetWorkFunctionDifferenceExample);
  });

  it("returns negative phiMs when the substrate work function dominates", () => {
    expect(
      calculateMosfetWorkFunctionDifference({
        gateWorkFunctionEv: 4.1,
        substrateWorkFunctionEv: 4.6,
      }),
    ).toEqual({ phiMsVolts: -0.5 });
  });

  it("yields zero when both materials share one work function", () => {
    expect(
      calculateMosfetWorkFunctionDifference({
        gateWorkFunctionEv: 4.61,
        substrateWorkFunctionEv: 4.61,
      }),
    ).toEqual({ phiMsVolts: 0 });
  });

  it("rejects non-positive material work functions", () => {
    const error = errorOf(
      runMosfetWorkFunctionDifference({
        gateWorkFunctionEv: -2,
        substrateWorkFunctionEv: 5,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
    expect(error.issues[0].field).toBe("gateWorkFunctionEv");
  });

  it("rejects NaN inputs through validation", () => {
    const error = errorOf(
      runMosfetWorkFunctionDifference({
        gateWorkFunctionEv: Number.NaN,
        substrateWorkFunctionEv: 4.1,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
  });

  it("rejects missing required inputs", () => {
    const error = errorOf(
      runMosfetWorkFunctionDifference({
        gateWorkFunctionEv: 4.6,
      }),
    );
    expect(error.code).toBe("invalid_input");
    expect(error.issues[0].code).toBe("invalid_field");
    expect(error.issues[0].field).toBe("substrateWorkFunctionEv");
  });

  it("rejects malformed input values", () => {
    const error = errorOf(
      runMosfetWorkFunctionDifference({
        gateWorkFunctionEv: "high",
        substrateWorkFunctionEv: 4.1,
      }),
    );
    expect(error.issues[0].field).toBe("gateWorkFunctionEv");
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runMosfetWorkFunctionDifference({
        extra: true,
        gateWorkFunctionEv: 4.6,
        substrateWorkFunctionEv: 4.1,
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const error = errorOf(runMosfetWorkFunctionDifference(42));
    expect(error.issues[0].code).toBe("object_required");
  });
});
