import { describe, expect, it } from "vitest";
import {
  servingTempLookupExample,
  servingTempLookupTool,
  runServingTempLookup,
} from "./tool.js";

describe("servingTempLookupTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runServingTempLookup(servingTempLookupExample.input)).toEqual({
      ok: true,
      output: servingTempLookupExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(servingTempLookupExample))).toEqual(
      servingTempLookupExample,
    );
    expect(servingTempLookupTool.contractVersion).toBe(1);
    expect(servingTempLookupTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runServingTempLookup(null).ok).toBe(false);
    expect(
      runServingTempLookup({
        ...servingTempLookupExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
