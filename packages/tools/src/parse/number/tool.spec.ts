import { describe, expect, it } from "vitest";
import { numberParserExample, parseNumber, runNumberParser } from "./tool.js";

describe("Text to Number Converter", () => {
  it.each([
    ["1,234.56", "en-US", 1234.56],
    ["1.234,56", "de-DE", 1234.56],
    ["1 234,56", "fr-FR", 1234.56],
    ["-1.25e2", "plain", -125],
  ] as const)("parses %s as %s", (text, format, expected) =>
    expect(parseNumber(text, format)).toBe(expected),
  );
  it("rejects ambiguous and non-finite text", () => {
    expect(parseNumber("1,234", "plain")).toBeNull();
    expect(parseNumber("Infinity", "plain")).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runNumberParser(numberParserExample.input)).toEqual({
      ok: true,
      output: numberParserExample.output,
    }));
});
