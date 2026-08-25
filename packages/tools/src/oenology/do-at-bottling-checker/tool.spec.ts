import { describe, expect, it } from "vitest";
import {
  doAtBottlingCheckerExample,
  doAtBottlingCheckerTool,
  runDoAtBottlingChecker,
} from "./tool.js";

describe("doAtBottlingCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runDoAtBottlingChecker(doAtBottlingCheckerExample.input)).toEqual({
      ok: true,
      output: doAtBottlingCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(doAtBottlingCheckerExample))).toEqual(
      doAtBottlingCheckerExample,
    );
    expect(doAtBottlingCheckerTool.contractVersion).toBe(1);
    expect(doAtBottlingCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDoAtBottlingChecker(null).ok).toBe(false);
    expect(
      runDoAtBottlingChecker({
        ...doAtBottlingCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
