import { describe, expect, it } from "vitest";
import { kebabCaseExample, calculateKebabCase, runKebabCase } from "./tool.js";

describe("text/kebab-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runKebabCase(kebabCaseExample.input)).toEqual({
      ok: true,
      output: kebabCaseExample.output,
    });
  });
  it("rejects invalid input (empty_text)", () => {
    expect(runKebabCase({ text: "" }).ok).toBe(false);
  });
  it("rejects invalid input (empty_text)", () => {
    expect(runKebabCase({ text: "   !!! ???" }).ok).toBe(false);
  });
  it("splits camelCase and collapses separators", () => {
    const result = runKebabCase({ text: "Foo Bar--baz quxQux" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.kebab).toBe("foo-bar-baz-qux-qux");
  });
});
