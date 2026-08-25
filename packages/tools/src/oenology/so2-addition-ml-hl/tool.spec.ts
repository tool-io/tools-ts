import { describe, expect, it } from "vitest";
import {
  so2AdditionMlHlExample,
  so2AdditionMlHlTool,
  runSo2AdditionMlHl,
} from "./tool.js";

describe("so2AdditionMlHlTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runSo2AdditionMlHl(so2AdditionMlHlExample.input)).toEqual({
      ok: true,
      output: so2AdditionMlHlExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(so2AdditionMlHlExample))).toEqual(
      so2AdditionMlHlExample,
    );
    expect(so2AdditionMlHlTool.contractVersion).toBe(1);
    expect(so2AdditionMlHlTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSo2AdditionMlHl(null).ok).toBe(false);
    expect(
      runSo2AdditionMlHl({
        ...so2AdditionMlHlExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
