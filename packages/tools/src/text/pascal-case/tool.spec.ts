import { describe, expect, it } from "vitest";
import {
  pascalCaseExample,
  calculatePascalCase,
  runPascalCase,
} from "./tool.js";

describe("text/pascal-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPascalCase(pascalCaseExample.input)).toEqual({
      ok: true,
      output: pascalCaseExample.output,
    });
  });
  it("rejects invalid input (empty_text)", () => {
    expect(runPascalCase({ text: "" }).ok).toBe(false);
  });
  it("rejects invalid input (empty_text)", () => {
    expect(runPascalCase({ text: "   !!! ???" }).ok).toBe(false);
  });
  it("normalizes existing casing per word", () => {
    const result = runPascalCase({ text: "XML HTTP request" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.pascal).toBe("XmlHttpRequest");
  });
});
