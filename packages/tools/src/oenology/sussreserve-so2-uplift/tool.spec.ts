import { describe, expect, it } from "vitest";
import {
  sussreserveSo2UpliftExample,
  sussreserveSo2UpliftTool,
  runSussreserveSo2Uplift,
} from "./tool.js";

describe("sussreserveSo2UpliftTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runSussreserveSo2Uplift(sussreserveSo2UpliftExample.input)).toEqual({
      ok: true,
      output: sussreserveSo2UpliftExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(sussreserveSo2UpliftExample))).toEqual(
      sussreserveSo2UpliftExample,
    );
    expect(sussreserveSo2UpliftTool.contractVersion).toBe(1);
    expect(sussreserveSo2UpliftTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSussreserveSo2Uplift(null).ok).toBe(false);
    expect(
      runSussreserveSo2Uplift({
        ...sussreserveSo2UpliftExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
