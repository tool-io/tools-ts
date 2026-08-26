import { describe, expect, it } from "vitest";
import {
  calculateGreekNominaSacraExpander,
  greekNominaSacraExpanderExample,
  runGreekNominaSacraExpander,
} from "./tool.js";

describe("epigraphy/greek-nomina-sacra-expander", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGreekNominaSacraExpander(greekNominaSacraExpanderExample.input),
    ).toEqual({ ok: true, output: greekNominaSacraExpanderExample.output });
  });

  it("passes surrounding prose through untouched", () => {
    const result = calculateGreekNominaSacraExpander({
      text: "\u03B5\u03BD \u03B1\u03C1\u03C7\u03B7 \u03B7\u03BD \u03BF \u039A\u03A3",
    });
    expect(result.nominaSacraCount).toBe(1);
    expect(
      result.expandedText.endsWith("\u039A\u03C5\u03C1\u03B9\u03BF\u03C2"),
    ).toBe(true);
    expect(
      result.expandedText.startsWith("\u03B5\u03BD \u03B1\u03C1\u03C7\u03B7"),
    ).toBe(true);
  });

  it("matches lowercase tokens too", () => {
    expect(
      calculateGreekNominaSacraExpander({
        text: "\u03C7\u03C3",
      }).expansions,
    ).toEqual(["\u03A7\u03A3 -> \u03A7\u03C1\u03B9\u03C3\u03C4\u03BF\u03C2"]);
  });

  it("rejects empty input", () => {
    expect(runGreekNominaSacraExpander({ text: "" }).ok).toBe(false);
  });
});
