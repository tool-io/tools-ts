import { describe, expect, it } from "vitest";
import {
  h2o2So2ReductionExample,
  h2o2So2ReductionTool,
  runH2o2So2Reduction,
} from "./tool.js";

describe("h2o2So2ReductionTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runH2o2So2Reduction(h2o2So2ReductionExample.input)).toEqual({
      ok: true,
      output: h2o2So2ReductionExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(h2o2So2ReductionExample))).toEqual(
      h2o2So2ReductionExample,
    );
    expect(h2o2So2ReductionTool.contractVersion).toBe(1);
    expect(h2o2So2ReductionTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runH2o2So2Reduction(null).ok).toBe(false);
    expect(
      runH2o2So2Reduction({
        ...h2o2So2ReductionExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
