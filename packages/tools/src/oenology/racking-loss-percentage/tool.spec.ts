import { describe, expect, it } from "vitest";
import {
  rackingLossPercentageExample,
  rackingLossPercentageTool,
  runRackingLossPercentage,
} from "./tool.js";

describe("rackingLossPercentageTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runRackingLossPercentage(rackingLossPercentageExample.input),
    ).toEqual({
      ok: true,
      output: rackingLossPercentageExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(rackingLossPercentageExample))).toEqual(
      rackingLossPercentageExample,
    );
    expect(rackingLossPercentageTool.contractVersion).toBe(1);
    expect(rackingLossPercentageTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runRackingLossPercentage(null).ok).toBe(false);
    expect(
      runRackingLossPercentage({
        ...rackingLossPercentageExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
