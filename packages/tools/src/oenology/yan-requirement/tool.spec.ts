import { describe, expect, it } from "vitest";
import {
  yanRequirementExample,
  yanRequirementTool,
  runYanRequirement,
} from "./tool.js";

describe("yanRequirementTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runYanRequirement(yanRequirementExample.input)).toEqual({
      ok: true,
      output: yanRequirementExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(yanRequirementExample))).toEqual(
      yanRequirementExample,
    );
    expect(yanRequirementTool.contractVersion).toBe(1);
    expect(yanRequirementTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runYanRequirement(null).ok).toBe(false);
    expect(
      runYanRequirement({ ...yanRequirementExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});
