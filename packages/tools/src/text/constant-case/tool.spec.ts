import { describe, expect, it } from "vitest";
import {
  constantCaseExample,
  calculateConstantCase,
  runConstantCase,
} from "./tool.js";

describe("text/constant-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runConstantCase(constantCaseExample.input)).toEqual({
      ok: true,
      output: constantCaseExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(runConstantCase({ text: "" }).ok).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(runConstantCase({ text: "...___---" }).ok).toBe(false);
  });
  it("handles mixed camel and delimiter input", () => {
    const result = runConstantCase({ text: "maxRetryCount-after" });
    expect(result).toEqual({
      ok: true,
      output: { formatted: "MAX_RETRY_COUNT_AFTER", wordCount: 4 },
    });
  });
});
