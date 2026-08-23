import { describe, expect, it } from "vitest";
import { camelCaseExample, calculateCamelCase, runCamelCase } from "./tool.js";

describe("text/camel-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCamelCase(camelCaseExample.input)).toEqual({
      ok: true,
      output: camelCaseExample.output,
    });
  });
  it("rejects invalid input (case)", () => {
    expect(runCamelCase({ text: "" }).ok).toBe(false);
  });
  it("rejects invalid input (case)", () => {
    expect(runCamelCase({ text: "   --__ " }).ok).toBe(false);
  });
  it("lowercases an acronym leading word", () => {
    const result = runCamelCase({ text: "HTTPServer version_2" });
    expect(result).toEqual({
      ok: true,
      output: { formatted: "httpServerVersion2", wordCount: 4 },
    });
  });

  it("splits kebab-case phrases", () => {
    const result = runCamelCase({ text: "background-color-red" });
    expect(result).toEqual({
      ok: true,
      output: { formatted: "backgroundColorRed", wordCount: 3 },
    });
  });
});
