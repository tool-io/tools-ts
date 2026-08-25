import { describe, expect, it } from "vitest";
import {
  corkSoakPlannerExample,
  corkSoakPlannerTool,
  runCorkSoakPlanner,
} from "./tool.js";

describe("corkSoakPlannerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCorkSoakPlanner(corkSoakPlannerExample.input)).toEqual({
      ok: true,
      output: corkSoakPlannerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(corkSoakPlannerExample))).toEqual(
      corkSoakPlannerExample,
    );
    expect(corkSoakPlannerTool.contractVersion).toBe(1);
    expect(corkSoakPlannerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCorkSoakPlanner(null).ok).toBe(false);
    expect(
      runCorkSoakPlanner({
        ...corkSoakPlannerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
