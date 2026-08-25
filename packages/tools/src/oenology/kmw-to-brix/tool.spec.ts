import { describe, expect, it } from "vitest";
import { kmwToBrixExample, kmwToBrixTool, runKmwToBrix } from "./tool.js";

describe("kmwToBrixTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runKmwToBrix(kmwToBrixExample.input)).toEqual({
      ok: true,
      output: kmwToBrixExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(kmwToBrixExample))).toEqual(
      kmwToBrixExample,
    );
    expect(kmwToBrixTool.contractVersion).toBe(1);
    expect(kmwToBrixTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runKmwToBrix(null).ok).toBe(false);
    expect(
      runKmwToBrix({ ...kmwToBrixExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });

  it("converts seventeen KMW to twenty mass-percent sucrose", () => {
    expect(runKmwToBrix({ kmw: 17 })).toEqual({
      ok: true,
      output: { brix: 20 },
    });
  });
});
