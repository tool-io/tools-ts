import { describe, expect, it } from "vitest";
import {
  pLoopBrevigraphExpanderExample,
  runPLoopBrevigraphExpander,
} from "./tool.js";

describe("p-loop-brevigraph-expander", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPLoopBrevigraphExpander(pLoopBrevigraphExpanderExample.input),
    ).toEqual({ ok: true, output: pLoopBrevigraphExpanderExample.output });
  });

  it("expands with the par reading when chosen", () => {
    const result = runPLoopBrevigraphExpander({
      stemBefore: "dis",
      endingAfter: "uire",
      sense: "par",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.expandedForm as string).toBe("disparuire");
    expect(result.output.appliedSense as string).toBe("par");
  });

  it("rejects non-alphabetic surroundings", () => {
    expect(
      runPLoopBrevigraphExpander({ stemBefore: "a1", endingAfter: "b" }).ok,
    ).toBe(false);
  });

  it("rejects an empty token", () => {
    expect(runPLoopBrevigraphExpander({}).ok).toBe(false);
  });
});
