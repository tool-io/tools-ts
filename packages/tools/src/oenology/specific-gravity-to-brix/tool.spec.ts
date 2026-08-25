import { describe, expect, it } from "vitest";
import {
  specificGravityToBrixExample,
  specificGravityToBrixTool,
  runSpecificGravityToBrix,
} from "./tool.js";

describe("specificGravityToBrixTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSpecificGravityToBrix(specificGravityToBrixExample.input),
    ).toEqual({
      ok: true,
      output: specificGravityToBrixExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(specificGravityToBrixExample))).toEqual(
      specificGravityToBrixExample,
    );
    expect(specificGravityToBrixTool.contractVersion).toBe(1);
    expect(specificGravityToBrixTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSpecificGravityToBrix(null).ok).toBe(false);
    expect(
      runSpecificGravityToBrix({
        ...specificGravityToBrixExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("specific gravity to brix boundaries", () => {
  it("reads zero Brix in water", () => {
    const result = runSpecificGravityToBrix({ specificGravity: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.brix).toBe(0);
  });

  it("scales a heavier must to more sugar", () => {
    const light = runSpecificGravityToBrix({ specificGravity: 1.06 });
    const heavy = runSpecificGravityToBrix({ specificGravity: 1.09 });
    expect(light.ok && heavy.ok).toBe(true);
    if (light.ok && heavy.ok)
      expect(heavy.output.brix as number).toBeGreaterThan(
        light.output.brix as number,
      );
  });
});
