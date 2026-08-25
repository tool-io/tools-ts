import { describe, expect, it } from "vitest";
import {
  brixToSpecificGravityExample,
  brixToSpecificGravityTool,
  runBrixToSpecificGravity,
} from "./tool.js";

describe("brixToSpecificGravityTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBrixToSpecificGravity(brixToSpecificGravityExample.input)).toEqual({
      ok: true,
      output: brixToSpecificGravityExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(brixToSpecificGravityExample))).toEqual(brixToSpecificGravityExample);
    expect(brixToSpecificGravityTool.contractVersion).toBe(1);
    expect(brixToSpecificGravityTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBrixToSpecificGravity(null).ok).toBe(false);
    expect(
      runBrixToSpecificGravity({ ...brixToSpecificGravityExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});

describe("brix to specific gravity boundaries", () => {
  it("returns water for zero sugar", () => {
    const result = runBrixToSpecificGravity({ brix: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.specificGravity).toBe(1);
  });
});
