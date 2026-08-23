import { describe, expect, it } from "vitest";
import {
  demonstratedCrosswindComparisonExample,
  runDemonstratedCrosswindComparison,
} from "./tool.js";

describe("demonstrated crosswind comparison", () => {
  it("reproduces its canonical example", () => {
    expect(
      runDemonstratedCrosswindComparison(
        demonstratedCrosswindComparisonExample.input,
      ),
    ).toEqual({
      ok: true,
      output: demonstratedCrosswindComparisonExample.output,
    });
  });
  it("reports equality as at or below", () => {
    expect(
      runDemonstratedCrosswindComparison({
        crosswindKt: 20,
        maxDemonstratedCrosswindKt: 20,
      }),
    ).toEqual({ ok: true, output: { atOrBelowDemonstratedValue: true } });
  });
  it("reports a higher component without calling it a limit", () => {
    expect(
      runDemonstratedCrosswindComparison({
        crosswindKt: 21,
        maxDemonstratedCrosswindKt: 20,
      }),
    ).toEqual({ ok: true, output: { atOrBelowDemonstratedValue: false } });
  });
});
