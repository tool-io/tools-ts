import { describe, expect, it } from "vitest";
import {
  runTwoColumnGutterChecker,
  twoColumnGutterCheckerExample,
} from "./tool.js";

describe("two-column-gutter-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTwoColumnGutterChecker(twoColumnGutterCheckerExample.input),
    ).toEqual({ ok: true, output: twoColumnGutterCheckerExample.output });
  });

  it("flags an inconsistent assembly beyond tolerance", () => {
    const result = runTwoColumnGutterChecker({
      columnOneWidthMm: 60,
      columnTwoWidthMm: 50,
      gutterWidthMm: 15,
      textBlockWidthMm: 130,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.discrepancyMillimetres as number).toBe(-5);
    expect(result.output.layoutConsistent as boolean).toBe(false);
  });

  it("rejects non-positive widths", () => {
    expect(
      runTwoColumnGutterChecker({
        columnOneWidthMm: 0,
        columnTwoWidthMm: 50,
        gutterWidthMm: 20,
        textBlockWidthMm: 120,
      }).ok,
    ).toBe(false);
  });
});
