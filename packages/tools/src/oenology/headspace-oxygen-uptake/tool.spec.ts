import { describe, expect, it } from "vitest";
import {
  headspaceOxygenUptakeExample,
  headspaceOxygenUptakeTool,
  runHeadspaceOxygenUptake,
} from "./tool.js";

describe("headspaceOxygenUptakeTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runHeadspaceOxygenUptake(headspaceOxygenUptakeExample.input),
    ).toEqual({
      ok: true,
      output: headspaceOxygenUptakeExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(headspaceOxygenUptakeExample))).toEqual(
      headspaceOxygenUptakeExample,
    );
    expect(headspaceOxygenUptakeTool.contractVersion).toBe(1);
    expect(headspaceOxygenUptakeTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runHeadspaceOxygenUptake(null).ok).toBe(false);
    expect(
      runHeadspaceOxygenUptake({
        ...headspaceOxygenUptakeExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
