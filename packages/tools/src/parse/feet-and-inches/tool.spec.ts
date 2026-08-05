import { describe, expect, it } from "vitest";
import {
  feetAndInchesParserExample,
  parseFeetAndInches,
  runFeetAndInchesParser,
} from "./tool.js";

describe("Feet and Inches Parser", () => {
  it.each([
    [`5'10"`, 70],
    ["5 ft 2 in", 62],
    ["5.5", 66],
  ] as const)("parses %s", (text, inches) =>
    expect(parseFeetAndInches(text)).toBe(inches),
  );
  it("supports negative values", () =>
    expect(parseFeetAndInches("-2'6\"")).toBe(-30));
  it("rejects invalid text", () =>
    expect(parseFeetAndInches("feet")).toBeNull());
  it("publishes an executable example", () =>
    expect(runFeetAndInchesParser(feetAndInchesParserExample.input)).toEqual({
      ok: true,
      output: feetAndInchesParserExample.output,
    }));
});
