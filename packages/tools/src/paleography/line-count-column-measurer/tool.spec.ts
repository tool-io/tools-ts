import { describe, expect, it } from "vitest";
import {
  lineCountColumnMeasurerExample,
  runLineCountColumnMeasurer,
} from "./tool.js";

describe("line-count-column-measurer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLineCountColumnMeasurer(lineCountColumnMeasurerExample.input),
    ).toEqual({ ok: true, output: lineCountColumnMeasurerExample.output });
  });

  it("defaults to a single column", () => {
    const result = runLineCountColumnMeasurer({
      linesPerColumn: 25,
      charactersPerLine: 30,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.linesPerPage as number).toBe(25);
    expect(result.output.charactersPerPage as number).toBe(750);
  });

  it("rejects non-positive counts", () => {
    expect(
      runLineCountColumnMeasurer({
        linesPerColumn: 0,
        charactersPerLine: 30,
      }).ok,
    ).toBe(false);
  });

  it("rejects page totals beyond the safe-integer range", () => {
    expect(
      runLineCountColumnMeasurer({
        linesPerColumn: Number.MAX_SAFE_INTEGER,
        charactersPerLine: 2,
      }).ok,
    ).toBe(false);
  });
});
