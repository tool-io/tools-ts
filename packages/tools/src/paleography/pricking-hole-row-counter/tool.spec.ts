import { describe, expect, it } from "vitest";
import {
  prickingHoleRowCounterExample,
  runPrickingHoleRowCounter,
} from "./tool.js";

describe("pricking-hole-row-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPrickingHoleRowCounter(prickingHoleRowCounterExample.input),
    ).toEqual({ ok: true, output: prickingHoleRowCounterExample.output });
  });

  it("calls a two-hole difference slightly off", () => {
    const result = runPrickingHoleRowCounter({
      holesAlongTopEdge: 30,
      holesAlongBottomEdge: 28,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.alignmentVerdict as string).toBe("slightly_off");
    expect(result.output.averagePerEdge as number).toBe(29);
  });

  it("rejects zero counts", () => {
    expect(
      runPrickingHoleRowCounter({
        holesAlongTopEdge: 0,
        holesAlongBottomEdge: 5,
      }).ok,
    ).toBe(false);
  });
});
