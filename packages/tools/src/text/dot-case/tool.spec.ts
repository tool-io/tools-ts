import { describe, expect, it } from "vitest";
import { dotCaseExample, calculateDotCase, runDotCase } from "./tool.js";

describe("text/dot-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDotCase(dotCaseExample.input)).toEqual({
      ok: true,
      output: dotCaseExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(runDotCase({ text: "" }).ok).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(runDotCase({ text: "  " }).ok).toBe(false);
  });
  it("converts PascalCase module paths", () => {
    const result = runDotCase({ text: "MyModule.InnerClass" });
    expect(result).toEqual({
      ok: true,
      output: { formatted: "my.module.inner.class", wordCount: 4 },
    });
  });
});
