import { describe, expect, it } from "vitest";
import { matrixLimitIssues, resourceLimitIssue, toolResourceLimits } from "./limits.js";

describe("tool resource limits", () => {
  it("accepts values at the declared limit", () => {
    expect(resourceLimitIssue("samples", toolResourceLimits.samples, "values")).toBeUndefined();
  });

  it("returns portable issues above a limit", () => {
    expect(resourceLimitIssue("iterations", toolResourceLimits.iterations + 1, "iterations")).toMatchObject({
      code: "resource_limit_exceeded",
      field: "iterations",
    });
    expect(matrixLimitIssues(129, 1)).not.toHaveLength(0);
  });
});
