import { describe, expect, it } from "vitest";
import {
  parsePercentage,
  percentageParserExample,
  runPercentageParser,
} from "./tool.js";

describe("Percentage Parser", () => {
  it("parses percentages and decimals", () => {
    expect(parsePercentage("12.5%", "plain", "decimal")).toBe(0.125);
    expect(parsePercentage("12.5", "plain", "percent")).toBe(0.125);
    expect(parsePercentage("0.125", "plain", "decimal")).toBe(0.125);
  });
  it("rejects misplaced percent signs", () =>
    expect(parsePercentage("1%2", "plain", "percent")).toBeNull());
  it("publishes an executable example", () =>
    expect(runPercentageParser(percentageParserExample.input)).toEqual({
      ok: true,
      output: percentageParserExample.output,
    }));
});
