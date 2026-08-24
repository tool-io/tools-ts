import { describe, expect, it } from "vitest";
import {
  calculateHollingsheadAbi,
  hollingsheadAbiStatusIndexExample,
  hollingsheadAbiStatusIndexTool,
  runHollingsheadAbiStatusIndex,
} from "./tool.js";

describe("hollingsheadAbiStatusIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runHollingsheadAbiStatusIndex(hollingsheadAbiStatusIndexExample.input),
    ).toEqual({
      ok: true,
      output: hollingsheadAbiStatusIndexExample.output,
    });
  });

  it("applies the seven-to-four weighting and accepts the scale endpoints", () => {
    expect(
      calculateHollingsheadAbi({ educationScale: 1, occupationScale: 1 }),
    ).toEqual({
      statusIndex: 11,
    });
    expect(
      calculateHollingsheadAbi({ educationScale: 7, occupationScale: 7 }),
    ).toEqual({
      statusIndex: 77,
    });
    const result = runHollingsheadAbiStatusIndex({
      educationScale: 1.5,
      occupationScale: 4,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("educationScale");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(hollingsheadAbiStatusIndexExample)),
    ).toEqual(hollingsheadAbiStatusIndexExample);
    expect(hollingsheadAbiStatusIndexTool.contractVersion).toBe(1);
    expect(hollingsheadAbiStatusIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runHollingsheadAbiStatusIndex(null).ok).toBe(false);
    expect(
      runHollingsheadAbiStatusIndex({
        ...hollingsheadAbiStatusIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
