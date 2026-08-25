import { describe, expect, it } from "vitest";
import {
  bottleFillHeightCheckExample,
  bottleFillHeightCheckTool,
  runBottleFillHeightCheck,
} from "./tool.js";

describe("bottleFillHeightCheckTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBottleFillHeightCheck(bottleFillHeightCheckExample.input)).toEqual({
      ok: true,
      output: bottleFillHeightCheckExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(bottleFillHeightCheckExample))).toEqual(bottleFillHeightCheckExample);
    expect(bottleFillHeightCheckTool.contractVersion).toBe(1);
    expect(bottleFillHeightCheckTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBottleFillHeightCheck(null).ok).toBe(false);
    expect(
      runBottleFillHeightCheck({ ...bottleFillHeightCheckExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
