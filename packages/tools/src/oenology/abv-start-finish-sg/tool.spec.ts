import { describe, expect, it } from "vitest";
import {
  abvStartFinishSgExample,
  abvStartFinishSgTool,
  runAbvStartFinishSg,
} from "./tool.js";

describe("abvStartFinishSgTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runAbvStartFinishSg(abvStartFinishSgExample.input)).toEqual({
      ok: true,
      output: abvStartFinishSgExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(abvStartFinishSgExample))).toEqual(abvStartFinishSgExample);
    expect(abvStartFinishSgTool.contractVersion).toBe(1);
    expect(abvStartFinishSgTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAbvStartFinishSg(null).ok).toBe(false);
    expect(
      runAbvStartFinishSg({ ...abvStartFinishSgExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
