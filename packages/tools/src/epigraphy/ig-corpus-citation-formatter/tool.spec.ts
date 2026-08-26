import { describe, expect, it } from "vitest";
import {
  igCorpusCitationFormatterExample,
  runIgCorpusCitationFormatter,
} from "./tool.js";

describe("ig-corpus-citation-formatter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIgCorpusCitationFormatter(igCorpusCitationFormatterExample.input),
    ).toEqual({
      ok: true,
      output: igCorpusCitationFormatterExample.output,
    });
  });

  it("formats plain citations without an edition superscript", () => {
    expect(
      runIgCorpusCitationFormatter({ volumeNumber: 7, inscriptionNumber: 425 }),
    ).toEqual({
      ok: true,
      output: { citation: "IG VII 425", volumeRoman: "VII" },
    });
  });
  it("rejects non-positive volumes", () => {
    expect(
      runIgCorpusCitationFormatter({ volumeNumber: 0, inscriptionNumber: 1 })
        .ok,
    ).toBe(false);
    expect(
      runIgCorpusCitationFormatter({ volumeNumber: 2.5, inscriptionNumber: 1 })
        .ok,
    ).toBe(false);
  });
});
