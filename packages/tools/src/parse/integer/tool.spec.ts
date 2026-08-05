import { describe, expect, it } from "vitest";
import {
  integerParserExample,
  parseInteger,
  runIntegerParser,
} from "./tool.js";

describe("Text to Integer Converter", () => {
  it("parses a localized safe integer", () =>
    expect(parseInteger("1,234", "en-US")).toBe(1234));
  it("rejects fractions and unsafe integers", () => {
    expect(parseInteger("1.5")).toBeNull();
    expect(parseInteger(String(Number.MAX_SAFE_INTEGER + 1))).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runIntegerParser(integerParserExample.input)).toEqual({
      ok: true,
      output: integerParserExample.output,
    }));
});
